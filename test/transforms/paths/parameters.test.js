const jsdocInfo = require('../../../consumers/jsdocInfo');
const setPaths = require('../../../transforms/paths');

describe('params tests', () => {
  it('should parse jsdoc path params', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {string} name.query.required - name param description
       * @operationId getInfo
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            operationId: 'getInfo',
            parameters: [{
              deprecated: false,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                type: 'string',
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should not parse jsdoc path params with malformed info', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {string} name param description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should parse jsdoc path params with array type', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {array<string>} name.query.required.deprecated - name param description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [{
              deprecated: true,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should parse jsdoc path multiple params', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {array<string>} name.query.required.deprecated - name param description
       * @param {number} phone.param
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [{
              deprecated: true,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            }, {
              deprecated: false,
              description: '',
              in: 'param',
              name: 'phone',
              required: false,
              schema: {
                type: 'number',
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should parse jsdoc path reference params', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {Song} name.query.required - name param description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [{
              deprecated: false,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                $ref: '#/components/schemas/Song',
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should parse jsdoc path params with array of references', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {array<Song>} name.query.required.deprecated - name param description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [{
              deprecated: true,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Song',
                },
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should parse jsdoc path params with enum values', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {string} name.query.required - name param description - enum:value1,value2
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [{
              deprecated: false,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                type: 'string',
                enum: [
                  'value1',
                  'value2',
                ],
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it('should parse jsdoc path params with enum values in diferent order', () => {
    const jsodInput = [`
      /**
       * GET /api/v1
       * @param {string} name.query.required - enum:value1,value2 - name param description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          get: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [{
              deprecated: false,
              description: 'name param description',
              in: 'query',
              name: 'name',
              required: true,
              schema: {
                type: 'string',
                enum: [
                  'value1',
                  'value2',
                ],
              },
            }],
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });
});
