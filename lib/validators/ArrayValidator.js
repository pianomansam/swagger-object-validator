"use strict";
var Promise = require("bluebird");
var ModelValidator_1 = require("./ModelValidator");
var result_1 = require("../result");
var pushError_1 = require("../helpers/pushError");
function validateArray(test, schema, spec, config, trace) {
    var errors = [];
    if (!Array.isArray(test)) {
        return Promise.resolve([
            {
                errorType: result_1.ValidationErrorType.TYPE_MISMATCH,
                trace: trace,
                typeShouldBe: 'array',
                typeIs: typeof test
            }
        ]);
    }
    if (schema.minItems && test.length < schema.minItems) {
        pushError_1.pushError({
            errorType: result_1.ValidationErrorType.CONSTRAINTS_VIOATION,
            trace: trace,
            constraintName: 'minItems',
            constraintValue: schema.minItems
        }, errors, test, schema, spec, config);
    }
    if (schema.maxItems && test.length > schema.maxItems) {
        pushError_1.pushError({
            errorType: result_1.ValidationErrorType.CONSTRAINTS_VIOATION,
            trace: trace,
            constraintName: 'maxItems',
            constraintValue: schema.maxItems
        }, errors, test, schema, spec, config);
    }
    if (schema.uniqueItems) {
        console.warn('WARNING: uniqueItems not supported (you found literally the only swagger feature that is currently unsupported)');
    }
    var promises = [];
    test.forEach(function (entry, index) {
        var newTrace = JSON.parse(JSON.stringify(trace));
        newTrace[newTrace.length - 1].arrayPos = index;
        promises.push(ModelValidator_1.validateModel(entry, schema.items, spec, config, newTrace));
    });
    return Promise.all(promises)
        .then(function (childErrors) { return childErrors.reduce(function (a, b) {
        return a.concat(b);
    }, errors); });
}
exports.validateArray = validateArray;
;
