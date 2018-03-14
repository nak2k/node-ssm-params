# ssm-params

Obtain parameters from AWS SSM Parameter Store.

## Installation

```
npm i ssm-params aws-sdk -S
```

## API

### ssmToObj(options, callback)

- `options`
    - If this is a string, it is equivalent to specify `options.prefix` only.
- `options.prefix`
    - A prefix of parameter names to obtain parameters.
- `options.target`
    - A target object that is set values of obtained parameters.
    - Default: `{}`
- `options.withDecryption`
    - If this is true, values of secure strings are decrypted.
- `callback(err, target)`
    - A callback which is called, when obtaining parameters have finished or an error occurs.
    - If no error occurs, `options.target` passes into `target`.

### ssmToObjByPath(options, callback)

- `options`
    - If this is a string, it is equivalent to specify `options.Path` only.
- `options.target`
    - A target object that is set values of obtained parameters.
    - Default: `{}`
- `options.nestObject`
    - A boolean value that determines whether to make a nested object from obtained parameters.
    - If this option is `true`, `options.Recursive` is also treated as `true`.
    - Default: `false`
- `options.trimPath`
    - A boolean value that determines whether to trim the hierarchy path from the name of obtained parameters.
    - Default: `true`
- `options.Path`
    - A hierarchy path to obtain parameters.
- `options.Recursive`
    - A boolean value that determines whether to obtain parameters recursively.
    - Default: `false`
- `options.WithDecryption`
    - If this is true, values of secure strings are decrypted.
    - Default: `false`
- `options.ParameterFilters`
    - An array of objects describing the conditions of the parameters to be retrieved.
- `callback(err, target)`
    - A callback which is called, when obtaining parameters have finished or an error occurs.
    - If no error occurs, `options.target` passes into `target`.

### ssmToEnv(prefix, [recursive,] callback)

This is equivalent to call `ssmToObj` or `ssmToObjByPath` with specifying `process.env` to a target.

- `prefix`
    - This is equivalent to `options.prefix` of `ssmToObj`.
    - If this argument starts with '/', this function calls `ssmToObjByPath` instead of `ssmToObj`.
- `recursive`
    - This is equivalent to `options.Recursive` of `ssmToObjByPath`.
- `callback(err, target)`
    - This is equivalent to `callback` of `ssmToObj`.

## Required IAM Permissions

- `ssm:DescribeParameters`
- `ssm:GetParameters`

## License

MIT
