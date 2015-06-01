import XmlNamespace = require("../Enumerations/XmlNamespace");
import Folder = require("../Core/ServiceObjects/Folders/Folder");
//import CalendarFolder = require("../Core/ServiceObjects/Folders/Calendar____Folder");
import FolderPermission = require("./FolderPermission");
import ComplexPropertyCollection = require("./ComplexPropertyCollection");
import ExchangeService = require("../Core/ExchangeService");
import EwsServiceXmlReader = require("../Core/EwsServiceXmlReader");
import EwsServiceXmlWriter = require("../Core/EwsServiceXmlWriter");
import XmlElementNames = require("../Core/XmlElementNames");


class FolderPermissionCollection extends ComplexPropertyCollection<FolderPermission> {
    private get InnerCollectionXmlElementName(): string { return this.isCalendarFolder ? XmlElementNames.CalendarPermissions : XmlElementNames.Permissions; }
    private get CollectionItemXmlElementName(): string { return this.isCalendarFolder ? XmlElementNames.CalendarPermission : XmlElementNames.Permission; }
    private isCalendarFolder: boolean;
    private unknownEntries: string[] = [];// System.Collections.ObjectModel.Collection<string>;
    get UnknownEntries(): string[] { return this.unknownEntries; }// System.Collections.ObjectModel.Collection<string>;
    constructor(owner: Folder) {
        super();
        this.isCalendarFolder = owner._FolderType === XmlElementNames.CalendarFolder; //owner instanceof CalendarFolder;
        
    }
    Add(permission: FolderPermission): void { this.InternalAdd(permission); }
    AddRange(permissions: FolderPermission[]/*System.Collections.Generic.IEnumerable<T>*/): void {
        //EwsUtilities.ValidateParam(permissions, "permissions");
        for (var permission of permissions) {
            this.Add(permission);
        }
    }
    Clear(): void { this.InternalClear(); }
    CreateComplexProperty(xmlElementName: string): FolderPermission { return new FolderPermission(); }
    CreateDefaultComplexProperty(): FolderPermission { return new FolderPermission(); }
    GetCollectionItemXmlElementName(complexProperty: FolderPermission): string { return this.CollectionItemXmlElementName; }
    InternalToJson(service: ExchangeService): any { throw new Error("FolderPermissionCollection.ts - InternalToJson : Not implemented."); }
    LoadFromJson(jsonProperty: any/*JsonObject*/, service: ExchangeService): any { throw new Error("FolderPermissionCollection.ts - LoadFromJson : Not implemented."); }
    LoadFromXmlJsObject(jsonProperty: any, localElementName: string): void {
        var jsonFolderPermissions: any[] = jsonProperty[this.InnerCollectionXmlElementName];
        if (jsonFolderPermissions && jsonFolderPermissions[this.CollectionItemXmlElementName])
            jsonFolderPermissions = jsonFolderPermissions[this.CollectionItemXmlElementName];
        if (!Array.isArray(jsonFolderPermissions)) {
            debugger;
            throw new Error("Invalid xml parsing, jsonproperty must contain collectionxmlelementname and collectionitemelementname underneeth");
        }
        for (var jsonFolderPermission of jsonFolderPermissions) {
            var permission: FolderPermission = new FolderPermission();
            debugger;//implement this
            permission.LoadFromXmlJsObject(jsonFolderPermission, undefined, undefined);
            this.InternalAdd(permission);
        }
        if (jsonProperty[XmlElementNames.UnknownEntries]) {
            var jsonUnknownEntries: any[] = jsonProperty[XmlElementNames.UnknownEntries];
            if (typeof jsonUnknownEntries !== 'object' && !Array.isArray(jsonFolderPermissions)) {
                debugger;
                throw new Error("Invalid xml returned - check for consistency, UnknownEntries must be array type");
            }
            debugger;//check for unknown entries type, shold be string or array of string
            for (var jsonUnknownEntry of jsonUnknownEntries) {
                this.unknownEntries.push(jsonUnknownEntry);
            }
        }
    }
    Remove(permission: FolderPermission): boolean { return this.InternalRemove(permission); }
    RemoveAt(index: number): void { this.InternalRemoveAt(index); }
    Validate(): void {
        for (var permissionIndex = 0; permissionIndex < this.Items.length; permissionIndex++) {
            var permission: FolderPermission = this.Items[permissionIndex];
            permission.Validate(this.isCalendarFolder, permissionIndex);
        }
    }
    WriteElementsToXml(writer: EwsServiceXmlWriter): void {
        writer.WriteStartElement(XmlNamespace.Types, this.InnerCollectionXmlElementName);
        for (var folderPermission of this.Items) {
            folderPermission.WriteToXml(
                writer,
                this.GetCollectionItemXmlElementName(folderPermission),
                undefined,//XmlNamespace - incorrect inheritance error with typesctipt in folderpermission class if removed xmlnamespace parameter
                this.isCalendarFolder);
        }
        writer.WriteEndElement(); // this.InnerCollectionXmlElementName
    }
}
export = FolderPermissionCollection;


//module Microsoft.Exchange.WebServices.Data {
//}
//import _export = Microsoft.Exchange.WebServices.Data;
//export = _export;
