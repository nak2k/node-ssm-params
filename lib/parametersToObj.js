exports.parametersToObj = parametersToObj;

function parametersToObj(options, data, callback) {
  const {
    Path,
    target = {},
    trimPath = true,
    nestObject = false,
  } = options;

  const { Parameters } = data;

  if (Parameters.length === 0) {
    return callback(null, target);
  }

  if (nestObject) {
    Parameters.forEach(({ Name, Value }) => {
      let key = trimPath ? Name.substr(Path.length) : Name;

      if (key[0] === '/') {
        key = key.substr(1);
      }

      setProperty(target, key.split('/'), Value);
    });
  } else {
    if (trimPath) {
      Parameters.forEach(({ Name, Value }) => {
        let key = Name.substr(Path.length);

        if (key[0] === '/') {
          key = key.substr(1);
        }

        target[key] = Value;
      });
    } else {
      Parameters.forEach(({ Name, Value }) => {
        target[Name] = Value;
      });
    }
  }

  callback(null, target);
}

function setProperty(obj, propList, value) {
  const lastIndex = propList.length - 1;

  if (lastIndex < 0) {
    return;
  }

  for (let index = 0; index < lastIndex; ++index) {
    const prop = propList[index];

    let nextObj = obj[prop];
    if (nextObj === undefined) {
      obj[prop] = nextObj = Object.create(null);
    }

    obj = nextObj;
  }

  obj[propList[lastIndex]] = value;
}
