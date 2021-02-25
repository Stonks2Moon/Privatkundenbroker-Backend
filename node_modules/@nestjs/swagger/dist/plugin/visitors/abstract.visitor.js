"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFileVisitor = void 0;
const ts = require("typescript");
const plugin_constants_1 = require("../plugin-constants");
class AbstractFileVisitor {
    updateImports(sourceFile, factory) {
        if (!factory) {
            return ts.updateSourceFileNode(sourceFile, [
                ts.createImportEqualsDeclaration(undefined, undefined, plugin_constants_1.OPENAPI_NAMESPACE, ts.createExternalModuleReference(ts.createLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME))),
                ...sourceFile.statements
            ]);
        }
        return factory.updateSourceFile(sourceFile, [
            factory.createImportEqualsDeclaration(undefined, undefined, plugin_constants_1.OPENAPI_NAMESPACE, factory.createExternalModuleReference(factory.createStringLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME))),
            ...sourceFile.statements
        ]);
    }
}
exports.AbstractFileVisitor = AbstractFileVisitor;
