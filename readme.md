# loggyslav [![Build Status](https://travis-ci.org/degordian/loggyslav.svg?branch=master)](https://travis-ci.org/degordian/loggyslav)

### What can loggyslav do for you?
- Make your `Typescript/Javascript` logging easier
- Prevent you from writing `console.log` all over the code
- Force you to write better code by encouraging you to write smaller methods and classes so you can easily log them 
- Give you a great tool with smart logging which enables you to easily trace and resolve possible bugs

[![Tell me more](https://media.makeameme.org/created/curious-tell-me.jpg)](https://github.com/degordian/loggyslav)

> Loggyslav is an npm module which easily attaches to any `class`, `method` or `property` and watches for any call or change.

> When attached to a `method` it can easily track every time it is called. It can log `input parameters` and `return value`.

> When attached to a `property` it can easily track every time it is updated.

## Usage


#### Using simple console log as a Method logging
```typescript
const simpleMethodLoggyslav = new SimpleMethodLoggyslav();
const targetsConfiguration: TargetsConfiguration = {
    targets: [
        {
            classType: SimpleClass,
            properties: ["a"],
        },
    ],
};
const loggerConfiguration = {
    methodLogger: simpleMethodLoggyslav,
};
const loggyslav = new Loggyslav(targetsConfiguration, loggerConfiguration);
```


#### Using Winston.js as Method logger

```typescript
const winstonNewLogger = new winston.Logger( {
    level: "info",
    transports: [
        new winston.transports.Console(),
    ],
} );
const winstonLogger = new WinstonLoggyslav(winstonNewLogger);
const targetsConfiguration: TargetsConfiguration = {
    targets: [
        {
            classType: SimpleClass,
        },
    ],
};
const loggerConfiguration: targetsConfiguration = {
    methodLogger: winstonLogger,
};

const loggyslav = new Loggyslav(
    targetsConfiguration,
    loggerConfiguration,
);
```

#### Using Winston.js as Error logger

```typescript
const winstonNewLogger = new winston.Logger( {
    level: "error",
    transports: [
        new winston.transports.Console(),
    ],
} );
const winstonLogger = new WinstonLoggyslav(winstonNewLogger);
const winstonErrorLogger = new WinstonErrorLoggyslav(winstonNewErrorLogger);

const targetsConfiguration: TargetsConfiguration = {
    targets: [
        {
            classType: SimpleClass,
        },
    ],
};
const loggerConfiguration: LoggerConfiguration = {
    methodLogger: winstonLogger,
    errorLogger: winstonErrorLogger,
};

const loggyslav = new Loggyslav(
    targetsConfiguration,
    loggerConfiguration,
);
```
### Features
TODO
### Development

Want to contribute? Great!

`loggyslav` is written with Typescript which builds automatically on `npm publish`. Behind every `PR` review is [Travis the guardian](https://travis-ci.org/degordian/loggyslav).

Build Typescript:
```
npm run build
```

Test your code:
```
npm test
```

Check your code style:
```
npm run tslint
```

