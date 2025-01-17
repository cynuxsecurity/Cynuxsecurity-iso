/*
 * ArcMenu - A traditional application menu for GNOME 3
 *
 * ArcMenu Lead Developer and Maintainer
 * Andrew Zaech https://gitlab.com/AndrewZaech
 * 
 * ArcMenu Founder, Former Maintainer, and Former Graphic Designer
 * LinxGem33 https://gitlab.com/LinxGem33 - (No Longer Active)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Me = imports.misc.extensionUtils.getCurrentExtension();
const {Gdk, GdkPixbuf, Gio, GLib, GObject, Gtk} = imports.gi;
const Constants = Me.imports.constants;
const Convenience = Me.imports.convenience;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const LayoutTweaks = Me.imports.menulayouts.tweaks;
const PW = Me.imports.prefsWidgets;
const Utils = Me.imports.utils;
const _ = Gettext.gettext;

const SCHEMA_PATH = '/org/gnome/shell/extensions/arcmenu/';
const GSET = 'gnome-shell-extension-tool';

var MenuSettingsPinnedAppsPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsPinnedAppsPage extends PW.NotebookPage {
        _init(settings) {
            super._init(_('Pinned Apps'));
            this._settings = settings;

            this.pinnedAppsScrollWindow = new Gtk.ScrolledWindow({
                valign: Gtk.Align.FILL,
                vexpand: true
            });
            this.pinnedAppsScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
            this.pinnedAppsScrollWindow.set_min_content_height(300);
            this.frame = new PW.FrameBox();
            this.saveButton = new Gtk.Button({
                label: _("Apply"),
                hexpand: true,
                halign: Gtk.Align.END,
                vexpand: false,
                valign: Gtk.Align.END
            });
            this._loadPinnedApps(this._settings.get_strv('pinned-app-list'));
            this.pinnedAppsScrollWindow.set_child(this.frame);
            this.append(this.pinnedAppsScrollWindow);
            
            let addPinnedAppsFrame = new PW.FrameBox();
            let addPinnedAppsFrameRow = new PW.FrameBoxRow();
            let addPinnedAppsFrameLabel = new Gtk.Label({
                label: _("Add More Apps"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let addPinnedAppsButton = new PW.Button({
                icon_name: 'list-add-symbolic',
                tooltip_text: _("Browse a list of all applications to add to your Pinned Apps list.")
            });
            addPinnedAppsButton.connect('clicked', ()=> {
                let dialog = new AddAppsToPinnedListWindow(this._settings, this, Constants.DIALOG_TYPE.Default);
                dialog.show();
                dialog.connect('response', ()=> { 
                    if(dialog.get_response()) {
                        let newPinnedApps = dialog.get_newPinnedAppsArray();
                        let array = []; 
                        for(let i = 0; i < newPinnedApps.length; i++){
                            array.push(newPinnedApps[i]._name);
                            array.push(newPinnedApps[i]._icon);
                            array.push(newPinnedApps[i]._cmd);
                        }
                        this._loadPinnedApps(array);
                        dialog.destroy();
                        this.frame.show();
                        this.saveButton.set_sensitive(true);
                    }
                    else
                        dialog.destroy();
                }); 
            });
            addPinnedAppsFrameRow.add(addPinnedAppsFrameLabel);
            addPinnedAppsFrameRow.add(addPinnedAppsButton);
            addPinnedAppsFrame.add(addPinnedAppsFrameRow);
            this.append(addPinnedAppsFrame);
            
            let addCustomAppFrame = new PW.FrameBox();
            let addCustomAppFrameRow = new PW.FrameBoxRow();
            let addCustomAppFrameLabel = new Gtk.Label({
                label: _("Add Custom Shortcut"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let addCustomAppButton = new PW.Button({
                icon_name: 'list-add-symbolic',
                tooltip_text: _("Create a custom shortcut to add to your Pinned Apps list.")
            });
            addCustomAppButton.connect('clicked', ()=> {
                let dialog = new AddCustomLinkDialogWindow(this._settings, this, Constants.DIALOG_TYPE.Default);
                dialog.show();
                dialog.connect('response', ()=> { 
                    if(dialog.get_response()) {
                        let newPinnedApps = dialog.get_newPinnedAppsArray();
                        this._loadPinnedApps(newPinnedApps);
                        dialog.destroy();
                        this.frame.show();
                        this.saveButton.set_sensitive(true);
                    }
                    else
                        dialog.destroy();
                }); 
            });
            addCustomAppFrameRow.add(addCustomAppFrameLabel);
            addCustomAppFrameRow.add(addCustomAppButton);
            addCustomAppFrame.add(addCustomAppFrameRow);
            this.append(addCustomAppFrame);
            
            this.saveButton.connect('clicked', ()=> {
                let array = [];
                for(let x = 0; x < this.frame.count; x++) {
                    array.push(this.frame.get_index(x)._name);
                    array.push(this.frame.get_index(x)._icon);
                    array.push(this.frame.get_index(x)._cmd);
                }
                this._settings.set_strv('pinned-app-list',array);
                this.saveButton.set_sensitive(false);
            }); 
            this.saveButton.set_halign(Gtk.Align.END);
            this.saveButton.set_sensitive(false);
            this.append(this.saveButton);
        }
         
        _loadPinnedApps(array) {
            for(let i = 0; i < array.length; i += 3) {
                let frameRow = new PW.FrameBoxDragRow(this.pinnedAppsScrollWindow);
                let iconString;
                frameRow._name = array[i];
                frameRow._icon = array[i + 1];
                frameRow._cmd = array[i + 2];
                frameRow.saveButton = this.saveButton;
                if(frameRow._icon === "ArcMenu_ArcMenuIcon"){
                    frameRow._icon = Me.path + '/media/icons/menu_icons/arc-menu-symbolic.svg';
                }
                iconString = frameRow._icon;
                if(frameRow._icon === "" && Gio.DesktopAppInfo.new(frameRow._cmd)){
                    iconString = Gio.DesktopAppInfo.new(frameRow._cmd).get_icon() ? Gio.DesktopAppInfo.new(frameRow._cmd).get_icon().to_string() : "";
                }
                frameRow._gicon = Gio.icon_new_for_string(iconString);
                let arcMenuImage = new Gtk.Image( {
                    gicon: frameRow._gicon,
                    pixel_size: 22
                });
                let dragImage = new Gtk.Image( {
                    gicon: Gio.icon_new_for_string("list-drag-handle-symbolic"),
                    pixel_size: 12
                });

                let arcMenuImageBox = new Gtk.Box({
                    margin_start: 0,
                    hexpand: false,
                    vexpand: false,
                    spacing: 5,
                });
                arcMenuImageBox.append(dragImage);
                arcMenuImageBox.append(arcMenuImage);
                frameRow.add(arcMenuImageBox);

                let frameLabel = new Gtk.Label({
                    use_markup: true,
                    xalign: 0,
                    hexpand: true
                });

                frameLabel.label = _(frameRow._name);

                checkIfValidShortcut(frameRow, frameLabel, arcMenuImage);

                frameRow.add(frameLabel);
                let buttonBox = new PW.EditEntriesBox({
                    frameRow: frameRow, 
                    frame: this.frame, 
                    buttons: [this.saveButton],
                    modifyButton: true,
                    deleteButton: true
                });

                buttonBox.connect('modify', ()=> {
                    let appArray = [frameRow._name,frameRow._icon,frameRow._cmd];
                    let dialog = new AddCustomLinkDialogWindow(this._settings, this, Constants.DIALOG_TYPE.Default, true, appArray);
                    dialog.show();
                    dialog.connect('response', ()=> { 
                        if(dialog.get_response()) {
                            let newPinnedApps = dialog.get_newPinnedAppsArray();
                            frameRow._name = newPinnedApps[0];
                            frameRow._icon = newPinnedApps[1];
                            frameRow._cmd = newPinnedApps[2];
                            frameLabel.label = _(frameRow._name);
                            if(frameRow._icon === "" && Gio.DesktopAppInfo.new(frameRow._cmd))
                                arcMenuImage.gicon = Gio.DesktopAppInfo.new(frameRow._cmd).get_icon();
                            else
                                arcMenuImage.gicon = Gio.icon_new_for_string(frameRow._icon);
                            dialog.destroy();
                            this.frame.show();
                            this.saveButton.set_sensitive(true);
                        }
                        else
                            dialog.destroy();
                    });  
                });
                frameRow.add(buttonBox);
                this.frame.add(frameRow);
            }
        }
});
 
var AddAppsToPinnedListWindow = GObject.registerClass(
    class Arc_Menu_AddAppsToPinnedListWindow extends PW.DialogWindow {
        _init(settings, parent, dialogType) {
            this._settings = settings;
            this._dialogType = dialogType;
            if(this._dialogType == Constants.DIALOG_TYPE.Default)  
                super._init(_('Add to your Pinned Apps'), parent);     
            else if(this._dialogType == Constants.DIALOG_TYPE.Mint_Pinned_Apps)
                super._init(_('Change Selected Pinned App'), parent);
            else if(this._dialogType == Constants.DIALOG_TYPE.Application_Shortcuts)
                super._init(_('Select Application Shortcuts'), parent);
            else if(this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts)
                super._init(_('Select Directory Shortcuts'), parent);
            this.newPinnedAppsArray=[];
            this.addResponse = false;
        }

        _createLayout(vbox) {
            let searchBar = new Gtk.SearchEntry({
                placeholder_text: _("Type to search…")
            });
            searchBar.connect('search-changed', ()=> {
                this._loadCategories();
                let applist = Gio.app_info_get_all();

                let pattern = searchBar.text;
                let searchResults = [];
                let res = [];
                for (let i in applist) {
                    let app = applist[i];
                    let match;
  
                    match = app.get_name().toLowerCase() + " ";
                    let info = Gio.DesktopAppInfo.new(app.get_id());
                
                    if (info.get_display_name()) 
                        match += info.get_display_name().toLowerCase() + " ";
                    if (info.get_executable()) 
                        match += info.get_executable().toLowerCase() + " ";
                    if (info.get_keywords()) 
                        match += info.get_keywords().toString().toLowerCase() + " ";
                    if (app.get_description()) 
                        match += app.get_description().toLowerCase();
                    

                    let index = match.indexOf(pattern);
                    if (index != -1) {
                        searchResults.push([index, app]);
                    }
                }
                let arcMenuSettings = _("ArcMenu Settings").toLowerCase();
                let index = arcMenuSettings.indexOf(pattern);
                let showArcMenuSettings = false;
                if (index != -1) {
                    showArcMenuSettings = true;
                }

                searchResults.sort(function(a,b) {
                    return a[0] > b[0];
                });
                res = searchResults.map(function(value,index) { return value[1]; });
                this.appsFrame.remove_all_children();
                this._loadCategories(res, showArcMenuSettings);
                this.appsFrame.show();

            });
            
            let pinnedAppsScrollWindow = new Gtk.ScrolledWindow();
            pinnedAppsScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
            pinnedAppsScrollWindow.set_max_content_height(300);
            pinnedAppsScrollWindow.set_min_content_height(300);
            pinnedAppsScrollWindow.set_min_content_width(500);
            pinnedAppsScrollWindow.set_min_content_width(500);
            this.appsFrame = new PW.FrameBox();
            let addAppsButton;
            if(this._dialogType == Constants.DIALOG_TYPE.Default || this._dialogType == Constants.DIALOG_TYPE.Application_Shortcuts
                || this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts){
                addAppsButton = new Gtk.Button({
                    label: _("Add")
                });

                addAppsButton.connect('clicked', ()=> {
                    this.addResponse = true;
                    this.response(-10);
                });
                addAppsButton.set_halign(Gtk.Align.END);
            }
            
            pinnedAppsScrollWindow.set_child(this.appsFrame);
            vbox.append(pinnedAppsScrollWindow);
            if(this._dialogType == Constants.DIALOG_TYPE.Default){
                this._loadCategories();
                vbox.append(addAppsButton);
                vbox.prepend(searchBar);
            }
            else if(this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts){
                let defaultApplicationShortcuts = this._settings.get_default_value('directory-shortcuts-list').deep_unpack();
                defaultApplicationShortcuts.push([_("Computer"), "ArcMenu_Computer", "ArcMenu_Computer"]);
                defaultApplicationShortcuts.push([_("Network"), "ArcMenu_Network", "ArcMenu_Network"]);
                defaultApplicationShortcuts.push([_("Trash"), "user-trash-symbolic", "ArcMenu_Trash"]);
                for(let i = 0;i < defaultApplicationShortcuts.length; i++) {
                    let frameRow = new PW.FrameBoxRow();
                    
                    frameRow._name = _(defaultApplicationShortcuts[i][0]);
                    frameRow._icon = defaultApplicationShortcuts[i][1];
                    frameRow._cmd = defaultApplicationShortcuts[i][2];

                    let iconImage = new Gtk.Image( {
                        gicon: Gio.icon_new_for_string(getIconPath(defaultApplicationShortcuts[i])),
                        pixel_size: 22
                    });

                    let iconImageBox = new Gtk.Box( {
                        orientation: Gtk.Orientation.VERTICAL,
                        margin_start: 5,
                        hexpand: false,
                        vexpand: false
                    });
                    iconImageBox.append(iconImage);
                    frameRow.add(iconImageBox);

                    let frameLabel = new Gtk.Label( {
                        use_markup: false,
                        xalign: 0,
                        hexpand: true
                    });
                    frameLabel.label = frameRow._name;
                    frameRow.add(frameLabel);
                    
                    let checkButton = new Gtk.CheckButton({
                        margin_end: 20
                    });
                    checkButton.connect('toggled', ()=> {
                        if(checkButton.get_active())
                            this.newPinnedAppsArray.push(frameRow);
                        else {
                            let index= this.newPinnedAppsArray.indexOf(frameRow);
                            this.newPinnedAppsArray.splice(index,1);
                        }
                    });
                    frameRow.add(checkButton);
                    this.appsFrame.add(frameRow);
                }
                vbox.append(addAppsButton);
            }
            else if(this._dialogType == Constants.DIALOG_TYPE.Application_Shortcuts){
                this._loadCategories();
                let defaultApplicationShortcutsFrame = new PW.FrameBox();
                let defaultApplicationShortcuts = this._settings.get_default_value('application-shortcuts-list').deep_unpack();
                defaultApplicationShortcuts.push([_("ArcMenu Settings"), Me.path + '/media/icons/menu_icons/arc-menu-symbolic.svg', Constants.ArcMenu_SettingsCommand]);
                defaultApplicationShortcuts.push([_("Run Command..."), "system-run-symbolic", "ArcMenu_RunCommand"]);
                defaultApplicationShortcuts.push([_("Show All Applications"), "view-fullscreen-symbolic", "ArcMenu_ShowAllApplications"]);
                
                for(let i = 0;i < defaultApplicationShortcuts.length; i++) {
                    let frameRow = new PW.FrameBoxRow();
                    frameRow._name = _(defaultApplicationShortcuts[i][0]);
                    frameRow._icon = defaultApplicationShortcuts[i][1];
                    frameRow._cmd = defaultApplicationShortcuts[i][2];

                    let iconImage = new Gtk.Image( {
                        gicon: Gio.icon_new_for_string(frameRow._icon),
                        pixel_size: 22
                    });

                    let iconImageBox = new Gtk.Box( {
                        orientation: Gtk.Orientation.VERTICAL,
                        margin_start: 5,
                        hexpand: false,
                        vexpand: false
                    });
                    iconImageBox.append(iconImage);
                    frameRow.add(iconImageBox);

                    let frameLabel = new Gtk.Label( {
                        use_markup: false,
                        xalign: 0,
                        hexpand: true
                    });
                    frameLabel.label = frameRow._name;
                    frameRow.add(frameLabel);
                    
                    let checkButton = new Gtk.CheckButton({
                        margin_end: 20
                    });
                    checkButton.connect('toggled', ()=> {
                        if(checkButton.get_active()) {
                            this.newPinnedAppsArray.push(frameRow);
                        }
                        else {
                            let index= this.newPinnedAppsArray.indexOf(frameRow);
                            this.newPinnedAppsArray.splice(index,1);
                        }
                    });
                    frameRow.add(checkButton);
                    
                    defaultApplicationShortcutsFrame.add(frameRow);
                    
                }
                let notebook = new PW.Notebook();

                let defaultAppsPage = new PW.NotebookPage(_("Default Apps"));
                notebook.append_page(defaultAppsPage);
                defaultAppsPage.append(defaultApplicationShortcutsFrame);
                vbox.remove(pinnedAppsScrollWindow);
                let systemAppsPage = new PW.NotebookPage(_("System Apps"));
                notebook.append_page(systemAppsPage);
                systemAppsPage.append(pinnedAppsScrollWindow);
                systemAppsPage.prepend(searchBar);

                vbox.append(notebook);
                vbox.append(addAppsButton);
            }
            else{
                this._loadCategories();
                let defaultAppsWindow = new Gtk.ScrolledWindow();
                defaultAppsWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
                defaultAppsWindow.set_max_content_height(300);
                defaultAppsWindow.set_min_content_height(300);
                defaultAppsWindow.set_min_content_width(500);
                defaultAppsWindow.set_min_content_width(500);
            
                let defaultApplicationShortcutsFrame = new PW.FrameBox();
                defaultAppsWindow.set_child(defaultApplicationShortcutsFrame);
                let defaultApplicationShortcuts = this._settings.get_default_value('directory-shortcuts-list').deep_unpack();
                defaultApplicationShortcuts.push([_("Computer"), "ArcMenu_Computer", "ArcMenu_Computer"]);
                defaultApplicationShortcuts.push([_("Network"), "ArcMenu_Network", "ArcMenu_Network"]);
                defaultApplicationShortcuts.push([_("Trash"), "user-trash-symbolic", "ArcMenu_Trash"]);
                defaultApplicationShortcuts.push([_("Lock"), "changes-prevent-symbolic", "ArcMenu_Lock"]);
                defaultApplicationShortcuts.push([_("Log Out"), "application-exit-symbolic", "ArcMenu_LogOut"]);
                defaultApplicationShortcuts.push([_("Power Off"), "system-shutdown-symbolic", "ArcMenu_PowerOff"]);
                defaultApplicationShortcuts.push([_("Restart"), Me.path + Constants.RESTART_ICON.Path, "ArcMenu_Restart"]);
                defaultApplicationShortcuts.push([_("Suspend"), "media-playback-pause-symbolic", "ArcMenu_Suspend"]);
                for(let i = 0;i < defaultApplicationShortcuts.length; i++) {
                    let frameRow = new PW.FrameBoxRow();

                    frameRow._name = _(defaultApplicationShortcuts[i][0]);
                    frameRow._icon = defaultApplicationShortcuts[i][1];
                    frameRow._cmd = defaultApplicationShortcuts[i][2];

                    let iconImage = new Gtk.Image( {
                        gicon: Gio.icon_new_for_string(getIconPath(defaultApplicationShortcuts[i])),
                        pixel_size: 22
                    });

                    let iconImageBox = new Gtk.Box( {
                        margin_start: 5,
                        hexpand: false,
                        vexpand: false
                    });
                    iconImageBox.append(iconImage);
                    frameRow.add(iconImageBox);

                    let frameLabel = new Gtk.Label( {
                        use_markup: false,
                        xalign: 0,
                        hexpand: true
                    });
                    frameLabel.label = frameRow._name;
                    frameRow.add(frameLabel);
                    
                    
                    let checkButton = new PW.Button({
                        icon_name: 'list-add-symbolic'
                    });
                    checkButton.margin_end = 20;
                    checkButton.connect('clicked', ()=> {
                        this.newPinnedAppsArray.push(frameRow._name, frameRow._icon, frameRow._cmd);
                        this.addResponse = true;
                        this.response(-10);
                    });
                    frameRow.add(checkButton);

                    defaultApplicationShortcutsFrame.add(frameRow);
                    
                }
                let notebook = new PW.Notebook();

                let defaultAppsPage = new PW.NotebookPage(_("Presets"));
                notebook.append_page(defaultAppsPage);
                defaultAppsPage.append(defaultAppsWindow);
                vbox.remove(pinnedAppsScrollWindow);
                let systemAppsPage = new PW.NotebookPage(_("System Apps"));
                notebook.append_page(systemAppsPage);
                systemAppsPage.append(pinnedAppsScrollWindow);
                systemAppsPage.prepend(searchBar);

                vbox.append(notebook);
            }
        }

        get_newPinnedAppsArray() {
            return this.newPinnedAppsArray;
        }

        get_response() {
            return this.addResponse;
        }

        _loadCategories(searchResults, showArcMenuSettings) {
            let allApps = searchResults ? searchResults : Gio.app_info_get_all();
            allApps.sort((a, b) => {
              let _a = a.get_display_name();
              let _b = b.get_display_name();
              return GLib.strcmp0(_a, _b);
            });

            let iter = -1;
            if(searchResults)
                iter = 0;
            if(showArcMenuSettings)
                iter = -1;    
            for(let i = iter; i < allApps.length; i++) {
                if(i == -1 ? true : allApps[i].should_show()) {
                    let frameRow = new PW.FrameBoxRow();
                    let icon;
                    if(i == -1){
                        frameRow._name = _("ArcMenu Settings");
                        icon = frameRow._icon = Me.path + '/media/icons/menu_icons/arc-menu-symbolic.svg';
                        frameRow._cmd = Constants.ArcMenu_SettingsCommand;
                    }
                    else{
                        frameRow._app = allApps[i];
                        frameRow._name = allApps[i].get_display_name();
                        frameRow._icon = '';
                        if(allApps[i].get_icon())
                            icon = allApps[i].get_icon().to_string();
                        else 
                            icon = "dialog-information";
                            
                        frameRow._cmd = allApps[i].get_id();
                    }
                   
                    let iconImage = new Gtk.Image( {
                        gicon: Gio.icon_new_for_string(icon),
                        pixel_size: 22
                    });

                    let iconImageBox = new Gtk.Box( {
                        margin_start: 5,
                        hexpand: false,
                        vexpand: false
                    });
                    iconImageBox.append(iconImage);
                    frameRow.add(iconImageBox);

                    let frameLabel = new Gtk.Label( {
                        use_markup: false,
                        xalign: 0,
                        hexpand: true
                    });
                    frameLabel.label = frameRow._name;
                    frameRow.add(frameLabel);
                    if(this._dialogType == Constants.DIALOG_TYPE.Default || this._dialogType == Constants.DIALOG_TYPE.Application_Shortcuts||
                        this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts){
                        let checkButton = new Gtk.CheckButton({
                            margin_end: 20
                        });
                        checkButton.connect('toggled', ()=> {
                            if(checkButton.get_active())
                                this.newPinnedAppsArray.push(frameRow);
                            else {
                                let index= this.newPinnedAppsArray.indexOf(frameRow);
                                this.newPinnedAppsArray.splice(index,1);
                            }
                        });
                        frameRow.add(checkButton);
                    }
                    else{
                        let checkButton = new PW.Button({
                            icon_name: 'list-add-symbolic'
                        });
                        checkButton.margin_end = 20;
                        checkButton.connect('clicked', ()=> {
                            this.newPinnedAppsArray.push(frameRow._name, frameRow._icon, frameRow._cmd);
                            this.addResponse = true;
                            this.response(-10);
                        });
                        frameRow.add(checkButton);
                    }

                    this.appsFrame.add(frameRow);
                }
            }
        }
});
    
var AddCustomLinkDialogWindow = GObject.registerClass(
    class Arc_Menu_AddCustomLinkDialogWindow extends PW.DialogWindow {
        _init(settings, parent, dialogType, isAppEdit=false, appArray=null) {
            this._settings = settings;
            this.newPinnedAppsArray=[];
            this.addResponse = false;
            this.isAppEdit = isAppEdit;
            this._dialogType = dialogType;
            this.appArray = appArray;
            if(this._dialogType == Constants.DIALOG_TYPE.Default)  
                super._init(isAppEdit?_('Edit Pinned App'):_('Add a Custom Shortcut'), parent);    
            else if(this._dialogType == Constants.DIALOG_TYPE.Mint_Pinned_Apps)
                super._init(isAppEdit?_('Edit Pinned App'):_('Add a Custom Shortcut'), parent);
            else if(this._dialogType == Constants.DIALOG_TYPE.Application_Shortcuts)
                super._init(isAppEdit?_('Edit Shortcut'):_('Add a Custom Shortcut'), parent);
            else if(this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts)
                super._init(isAppEdit?_('Edit Custom Shortcut'):_('Add a Custom Shortcut'), parent);
        }

        _createLayout(vbox) {
            let mainFrame = new PW.FrameBox();
            let nameFrameRow = new PW.FrameBoxRow();
            let nameFrameLabel = new Gtk.Label({
                label: _('Shortcut Name:'),
                use_markup: true,
                xalign: 0,
                hexpand: true,
                selectable: false
            });
            let nameEntry = new Gtk.Entry();
            nameEntry.set_width_chars(35);
            nameFrameRow.add(nameFrameLabel);
            nameFrameRow.add(nameEntry);
            nameEntry.grab_focus();
            mainFrame.add(nameFrameRow);

            let iconFrameRow = new PW.FrameBoxRow();
            let iconFrameLabel = new Gtk.Label({
                label: _("Icon:"),
                use_markup: true,
                xalign: 0,
                hexpand: true,
                selectable: false
            });
            let iconEntry = new Gtk.Entry();
            iconEntry.set_width_chars(35);

            let fileFilter = new Gtk.FileFilter();
            fileFilter.add_pixbuf_formats();
            let fileChooserButton = new Gtk.Button({
                label: _('Browse...')
            });

            fileChooserButton.connect('clicked', (widget) => {
                let dialog = new Gtk.FileChooserDialog({ 
                    title: _('Select an Icon'),
                    transient_for: this.get_root(), 
                    modal: true,
                    action: Gtk.FileChooserAction.OPEN,
                });
                dialog.add_button("_Cancel", Gtk.ResponseType.CANCEL);
                dialog.add_button("_Open", Gtk.ResponseType.ACCEPT);

                dialog.set_filter(fileFilter);
        
                dialog.connect("response", (self, response) => {
                    if(response === Gtk.ResponseType.ACCEPT){
                        let iconFilepath = dialog.get_file().get_path();
                        iconEntry.set_text(iconFilepath);
                        dialog.destroy();
                    }
                    else if(response === Gtk.ResponseType.CANCEL)
                        dialog.destroy();
                })

                dialog.show();
            });

            iconFrameRow.add(iconFrameLabel);
            iconFrameRow.add(fileChooserButton);
            iconFrameRow.add(iconEntry);
            mainFrame.add(iconFrameRow);
            if(this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts)
                iconEntry.set_text("ArcMenu_Folder");  

            let cmdFrameRow = new PW.FrameBoxRow();
            let cmdFrameLabel = new Gtk.Label({
                label: _('Terminal Command:'),
                use_markup: true,
                xalign: 0,
                hexpand: true,
                selectable: false
            });
            if(this._dialogType == Constants.DIALOG_TYPE.Directories_Shortcuts)
                cmdFrameLabel.label =  _("Shortcut Path:");
            let cmdEntry = new Gtk.Entry();
            cmdEntry.set_width_chars(35);
            cmdFrameRow.add(cmdFrameLabel);
            cmdFrameRow.add(cmdEntry);
            mainFrame.add(cmdFrameRow);

            let addButton = new Gtk.Button({
                label: this.isAppEdit ?_("Apply") :_("Add")
            });

            if(this.appArray!=null) {
                nameEntry.text=this.appArray[0];
                iconEntry.text=this.appArray[1];
                cmdEntry.text=this.appArray[2];
            }
            addButton.connect('clicked', ()=> {
                this.newPinnedAppsArray.push(nameEntry.get_text());
                this.newPinnedAppsArray.push(iconEntry.get_text());
                this.newPinnedAppsArray.push(cmdEntry.get_text());
                this.addResponse = true;
                this.response(-10);
            });
            addButton.set_halign(Gtk.Align.END);

            vbox.append(mainFrame);
            vbox.append(addButton);
        }

        get_newPinnedAppsArray(){
          return this.newPinnedAppsArray;
        }

        get_response(){
          return this.addResponse;
        }
});

var GeneralPage = GObject.registerClass(
    class Arc_Menu_GeneralPage extends PW.NotebookPage {
        _init(settings) {
            super._init(_('General'));
            this._settings = settings;
            
            let arcMenuPlacementHeader = new Gtk.Label({
                label: "<b>" + _("Panel and Dock Options") + "</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.append(arcMenuPlacementHeader);
            let menuPlacementFrame = new PW.FrameBox();
            this._createDisplayOnFrame(menuPlacementFrame, true);     
            this._settings.connect('changed::available-placement', ()=>{
                menuPlacementFrame.remove_all_children();
                this._createDisplayOnFrame(menuPlacementFrame, false);   
                menuPlacementFrame.show();
            }) 

            this.append(menuPlacementFrame);
        
            let hotCornerHeader = new Gtk.Label({
                label: "<b>" + _("Activities Hot Corner Options") + "</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.append(hotCornerHeader);

            let modifyHotCornerFrame = new PW.FrameBox();
            let modifyHotCornerRow = new PW.FrameBoxRow();
            let modifyHotCornerLabel = new Gtk.Label({
                label: _("Modify Activities Hot Corner"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            
            let modifyHotCornerButton = new PW.Button({
                icon_name: 'emblem-system-symbolic',
                tooltip_text: _("Modify the action of the Activities Hot Corner")
            });
            modifyHotCornerButton.connect('clicked', ()=> {
                let dialog = new ModifyHotCornerDialogWindow(this._settings, this);
                dialog.show();
                dialog.connect('response', ()=> { 
                    dialog.destroy();
                }); 
            });
            let modifyHotCornerSwitch = new Gtk.Switch({ 
                halign: Gtk.Align.END,
                valign: Gtk.Align.CENTER,
                tooltip_text: _("Override the default behavoir of the Activities Hot Corner")
            });
            modifyHotCornerSwitch.set_active(this._settings.get_boolean('override-hot-corners'));
            modifyHotCornerButton.set_sensitive(this._settings.get_boolean('override-hot-corners'));
            modifyHotCornerSwitch.connect('notify::active', (widget) => {
                this._settings.set_boolean('override-hot-corners',widget.get_active());
                modifyHotCornerButton.set_sensitive(widget.get_active());
                if(!widget.get_active()){
                    this._settings.set_enum('hot-corners',Constants.HOT_CORNERS_ACTION.Default);
                }
            });
            modifyHotCornerRow.add(modifyHotCornerLabel);
            modifyHotCornerRow.add(modifyHotCornerButton);
            modifyHotCornerRow.add(modifyHotCornerSwitch);
            modifyHotCornerFrame.add(modifyHotCornerRow);
            this.append(modifyHotCornerFrame);

            let keyReleaseRow = new PW.FrameBoxRow();
            let keyReleaseLabel = new Gtk.Label({
                label: _("Hotkey activation"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let keyReleaseCombo = new Gtk.ComboBoxText({ 
                halign: Gtk.Align.END,
                tooltip_text: _("Choose a method for the hotkey activation")  
            });
            keyReleaseCombo.append_text(_("Key Release"));
            keyReleaseCombo.append_text(_("Key Press"));
            if(this._settings.get_boolean('disable-hotkey-onkeyrelease'))
                keyReleaseCombo.set_active(1);
            else 
                keyReleaseCombo.set_active(0);
            keyReleaseCombo.connect('changed', (widget) => {
                if(widget.get_active()==0)
                    this._settings.set_boolean('disable-hotkey-onkeyrelease',false);
                if(widget.get_active()==1)
                    this._settings.set_boolean('disable-hotkey-onkeyrelease',true);
            });

            keyReleaseRow.add(keyReleaseLabel);
            keyReleaseRow.add(keyReleaseCombo);

            let menuHotkeyHeader = new Gtk.Label({
                label: "<b>" + _("Hotkey Options") + "</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.append(menuHotkeyHeader);

            this.menuKeybindingFrame = new PW.FrameBox();
            let menuHotkeyLabelRow = new PW.FrameBoxRow();
            let menuHotkeyLabel = new Gtk.Label({
                label: _("Choose a Hotkey for ArcMenu"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            menuHotkeyLabelRow.add(menuHotkeyLabel);

            let menuHotkeyButtonRow = new PW.FrameBoxRow();
            let leftButton = new Gtk.ToggleButton({
                label: _("Left Super Key"),
                halign: Gtk.Align.CENTER,
                hexpand: true,
                tooltip_text: _("Set ArcMenu hotkey to Left Super Key")  
            });   
            let rightButton = new Gtk.ToggleButton({
                label: _("Right Super Key"),
                group: leftButton,
                halign: Gtk.Align.CENTER,
                hexpand: true,
                tooltip_text: _("Set ArcMenu hotkey to Right Super Key")  
            });   
            let customButton = new Gtk.ToggleButton({
                label: _("Custom Hotkey"),
                group: leftButton,
                halign: Gtk.Align.CENTER,
                hexpand: true,
                tooltip_text: _("Set a custom hotkey for ArcMenu")  
            });   
            this.undefinedButton = new Gtk.ToggleButton({
                label: _("None"),
                group: leftButton,
                halign: Gtk.Align.CENTER,
                hexpand: true,
                tooltip_text: _("Clear ArcMenu hotkey, use GNOME default")  
            });  
            switch (this._settings.get_enum('menu-hotkey')) {
                case 0:
                    this.undefinedButton.set_active(true);
                    break;
                case 1:
                    leftButton.set_active(true);
                    break;
                case 2:
                    rightButton.set_active(true);
                    break;
                case 3:
                    customButton.set_active(true);
                    break;
            }
            this.undefinedButton.connect('toggled', () => {
                if(this.undefinedButton.get_active()){
                    if(this.menuKeybindingFrame.count > 2)
                        this.menuKeybindingFrame.removeChildrenAfterIndex(1);
                    this._settings.set_enum('menu-hotkey', 0);
                }
            });
            leftButton.connect('toggled', () => {
                if(leftButton.get_active()){
                    if(this.menuKeybindingFrame.count > 2)
                        this.menuKeybindingFrame.removeChildrenAfterIndex(1);
                    this._settings.set_enum('menu-hotkey', 1);
                }    
            });
            rightButton.connect('toggled', () => {
                if(rightButton.get_active()){
                    if(this.menuKeybindingFrame.count > 2)
                        this.menuKeybindingFrame.removeChildrenAfterIndex(1);
                    this.menuKeybindingFrame.add(keyReleaseRow);
                    this.menuKeybindingFrame.show();
                    this._settings.set_enum('menu-hotkey', 2);
                }
            });
            customButton.connect('toggled', () => {
                if(customButton.get_active()){
                    if(this.menuKeybindingFrame.count > 2)
                        this.menuKeybindingFrame.removeChildrenAfterIndex(1);
                    this.menuKeybindingFrame.add(menuKeybindingRow);
                    this.menuKeybindingFrame.add(keyReleaseRow);
                    this.menuKeybindingFrame.show();
                    this._settings.set_enum('menu-hotkey', 3);
                }
            });

            menuHotkeyButtonRow.add(this.undefinedButton);
            menuHotkeyButtonRow.add(leftButton);
            menuHotkeyButtonRow.add(rightButton);
            menuHotkeyButtonRow.add(customButton);

            this.menuKeybindingFrame.add(menuHotkeyLabelRow);
            this.menuKeybindingFrame.add(menuHotkeyButtonRow);

            let menuKeybindingRow = new PW.FrameBoxRow();    
            let currentHotkeyLabel = new Gtk.Label( {
                label: _("Current Hotkey"),
                use_markup: true,
                xalign: 0,
                hexpand: false
            });

            let shortcutCell = new Gtk.ShortcutsShortcut({
                halign: Gtk.Align.CENTER,
                hexpand: true,
                tooltip_text: _("Current custom hotkey")  
            });
            shortcutCell.accelerator = this._settings.get_string('menu-keybinding-text');
            
            let modifyHotkeyButton = new Gtk.Button({
                label: _("Modify Hotkey"),
                halign: Gtk.Align.END,
                hexpand: false,
                tooltip_text: _("Create your own hotkey combination for ArcMenu")  
            });   
            menuKeybindingRow.add(currentHotkeyLabel);
            menuKeybindingRow.add(shortcutCell);
            menuKeybindingRow.add(modifyHotkeyButton);
            modifyHotkeyButton.connect('clicked', () => {
                let dialog = new CustomHotkeyDialogWindow(this._settings, this);
                dialog.show();
                dialog.connect('response', () => {   
                    if(dialog.addResponse) {
                        this._settings.set_enum('menu-hotkey', 0);
                        this._settings.set_string('menu-keybinding-text', dialog.resultsText);
                        this._settings.set_enum('menu-hotkey', 3);
                        shortcutCell.accelerator = dialog.resultsText;                   
                        dialog.destroy();
                    }
                    else {
                        shortcutCell.accelerator = this._settings.get_string('menu-keybinding-text');
                        this._settings.set_enum('menu-hotkey', 3);
                        dialog.destroy();
                    }
                }); 
            });
            if(this._settings.get_enum('menu-hotkey')==2)
                this.menuKeybindingFrame.add(keyReleaseRow);
            if(this._settings.get_enum('menu-hotkey')==3 ){
                this.menuKeybindingFrame.add(menuKeybindingRow);
                this.menuKeybindingFrame.add(keyReleaseRow);
            }
            this.append(this.menuKeybindingFrame);
        }
        _createDisplayOnFrame(menuPlacementFrame, setComboBox){
            let menuPlacementRow = new PW.FrameBoxRow();
            let menuPlacementLabel = new Gtk.Label({
                label: _("Display ArcMenu On"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let menuPlacementCombo = new Gtk.ComboBoxText({ 
                halign: Gtk.Align.END,
                tooltip_text: _("Choose where to place ArcMenu") 
            });

            let avaliablePlacement = this._settings.get_value('available-placement').deep_unpack();
            let dashExtensionName = _("Dash to Dock");
            let gnomeSettings = Gio.Settings.new("org.gnome.shell");
            let enabledExtensions = gnomeSettings.get_strv('enabled-extensions');
            if (enabledExtensions.includes('ubuntu-dock@ubuntu.com')) {
                dashExtensionName = _("Ubuntu Dock");
            }
    
            menuPlacementCombo.append_text(_("Main Panel"));
            menuPlacementCombo.append_text(_("Dash to Panel"));
            menuPlacementCombo.append_text(dashExtensionName);

            menuPlacementRow.add(menuPlacementLabel);
            menuPlacementRow.add(menuPlacementCombo);
            menuPlacementFrame.add(menuPlacementRow);

            let dashToDockWarningRow = new PW.FrameBoxRow();
            let dashToDockWarningLabel = new Gtk.Label({
                label: _("Dash to Dock extension not running!") + "\n" + _("Enable Dash to Dock for this feature to work."),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let showActivitiesRow = new PW.FrameBoxRow();
            let showActivitiesLabel = new Gtk.Label({
                label: _("Show Activities Button"),                 
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let showActivitiesSwitch = new Gtk.Switch({ 
                halign: Gtk.Align.END,
                tooltip_text: _("Show Activities Button in panel") 
            });
            showActivitiesSwitch.set_active(this._settings.get_boolean('show-activities-button'));
            showActivitiesSwitch.connect('notify::active', (widget) => {
                this._settings.set_boolean('show-activities-button', widget.get_active());
            });
            showActivitiesRow.add(showActivitiesLabel);
            showActivitiesRow.add(showActivitiesSwitch);

            let warningImage = new Gtk.Image({ 
                icon_name: 'warning-symbolic',
                pixel_size: 24
            });
            let warningImageBox = new Gtk.Box({
                margin_top: 0,
                margin_bottom: 0,
                margin_start: 10
            });
            warningImageBox.append(warningImage);

            if(!avaliablePlacement[Constants.ArcMenuPlacement.DASH]){
                dashToDockWarningRow.add(warningImageBox);
            }
            dashToDockWarningRow.add(dashToDockWarningLabel);

            let panelWarningRow = new PW.FrameBoxRow();
            let panelWarningLabel = new Gtk.Label({
                label: avaliablePlacement[Constants.ArcMenuPlacement.DTP] ? _("Main Panel not found!") :
                                            _("Dash to Panel extension not running!") + "\n" + _("Enable Dash to Panel for this feature to work."),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });    
            let panelWarningImage = new Gtk.Image({ 
                icon_name: 'warning-symbolic',
                pixel_size: 24
            });
            let panelWarningImageBox = new Gtk.Box({
                margin_top: 0,
                margin_bottom: 0,
                margin_start: 10
            });
            panelWarningImageBox.append(panelWarningImage);
            panelWarningRow.add(panelWarningImageBox);
            panelWarningRow.add(panelWarningLabel);

            let menuPositionRow = new PW.FrameBoxRow();
            let menuPositionBoxLabel = new Gtk.Label({
                label: _("Position in panel"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let menuPositionLeftButton = new Gtk.ToggleButton({
                label: _('Left'),
                tooltip_text: _("Position ArcMenu on the left side of the panel")
            });
            let menuPositionCenterButton = new Gtk.ToggleButton({
                label: _('Center'),
                group: menuPositionLeftButton,
                tooltip_text: _("Position ArcMenu in the center of the panel")
            });
            let menuPositionRightButton = new Gtk.ToggleButton({
                label: _('Right'),
                group: menuPositionLeftButton,
                tooltip_text: _("Position ArcMenu on the right side of the panel")
            });
            

            switch (this._settings.get_enum('position-in-panel')) {
                case Constants.MENU_POSITION.Left:
                    menuPositionLeftButton.set_active(true);
                    break;
                case Constants.MENU_POSITION.Center:
                    menuPositionCenterButton.set_active(true);
                    break;
                case Constants.MENU_POSITION.Right:
                    menuPositionRightButton.set_active(true);
                    break;
            }

            menuPositionRow.add(menuPositionBoxLabel);
            menuPositionRow.add(menuPositionLeftButton);
            menuPositionRow.add(menuPositionCenterButton);
            menuPositionRow.add(menuPositionRightButton);
            
            let menuPositionAdjustmentRow = new PW.FrameBoxRow();
            let menuPositionAdjustmentLabel = new Gtk.Label({
                label: _("Menu Alignment"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let alignmentScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL, 
                adjustment: new Gtk.Adjustment({lower: 0, upper: 100, step_increment: 1, page_increment: 1, page_size: 0}),
                digits: 0, round_digits: 0, hexpand: true,
                tooltip_text: _("Adjust ArcMenu's menu alignment relative to ArcMenu's icon")
            });
            alignmentScale.add_mark(0, Gtk.PositionType.BOTTOM, _("Left"));
            alignmentScale.add_mark(50, Gtk.PositionType.BOTTOM, _("Center"));
            alignmentScale.add_mark(100, Gtk.PositionType.BOTTOM, _("Right"));

            alignmentScale.set_value(this._settings.get_int('menu-position-alignment'));
            alignmentScale.connect('value-changed', (widget) => {
                this._settings.set_int('menu-position-alignment', widget.get_value());
            }); 
            menuPositionAdjustmentRow.add(menuPositionAdjustmentLabel);
            menuPositionAdjustmentRow.add(alignmentScale);

            let multiMonitorRow = new PW.FrameBoxRow();
            let multiMonitorLabel = new Gtk.Label({
                label: _("Display ArcMenu on all monitors"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let multiMonitorSwitch = new Gtk.Switch({ 
                halign: Gtk.Align.END,
                tooltip_text: _("Display ArcMenu on all monitors") 
            });
            multiMonitorSwitch.set_active(this._settings.get_boolean('multi-monitor'));
            multiMonitorSwitch.connect('notify::active', (widget) => {
                this._settings.set_boolean('multi-monitor', widget.get_active());
            });

            multiMonitorRow.add(multiMonitorLabel);
            multiMonitorRow.add(multiMonitorSwitch);
            
            menuPlacementCombo.connect('changed', (widget) => {
                let placement = widget.get_active();
                this._settings.set_enum('arc-menu-placement', placement);
                menuPlacementFrame.remove_all_children();
                menuPlacementFrame.add(menuPlacementRow);
                if(menuPlacementCombo.get_active() == Constants.ArcMenuPlacement.PANEL){
                    if(avaliablePlacement[Constants.ArcMenuPlacement.PANEL] === false){
                        menuPlacementFrame.add(panelWarningRow);
                    }
                    else{
                        menuPlacementFrame.add(menuPositionRow);
                        if(this._settings.get_enum('position-in-panel') == Constants.MENU_POSITION.Center)
                            menuPlacementFrame.add(menuPositionAdjustmentRow);
                        if(avaliablePlacement[Constants.ArcMenuPlacement.DTP])
                            menuPlacementFrame.add(multiMonitorRow);
                        menuPlacementFrame.add(showActivitiesRow);
                    }
                    menuPlacementFrame.show();
                }
                else if(menuPlacementCombo.get_active() == Constants.ArcMenuPlacement.DTP){
                    if(avaliablePlacement[Constants.ArcMenuPlacement.DTP]){
                        menuPlacementFrame.add(menuPositionRow);
                        if(this._settings.get_enum('position-in-panel') == Constants.MENU_POSITION.Center)
                            menuPlacementFrame.add(menuPositionAdjustmentRow);
                        menuPlacementFrame.add(multiMonitorRow);
                        menuPlacementFrame.add(showActivitiesRow);
                    }
                    else
                        menuPlacementFrame.add(panelWarningRow);
    
                    menuPlacementFrame.show();
                }
                else{
                    if(avaliablePlacement[Constants.ArcMenuPlacement.DASH]){
                        menuPlacementFrame.add(multiMonitorRow);
                        menuPlacementFrame.add(showActivitiesRow);  
                    }
                    else
                        menuPlacementFrame.add(dashToDockWarningRow);

                    menuPlacementFrame.show();
                }
            });
            let placement = this._settings.get_enum('arc-menu-placement');
            if(setComboBox){
                if(placement == Constants.ArcMenuPlacement.PANEL && !avaliablePlacement[Constants.ArcMenuPlacement.PANEL])
                    menuPlacementCombo.set_active(Constants.ArcMenuPlacement.DTP);
                else if(placement == Constants.ArcMenuPlacement.DTP && !avaliablePlacement[Constants.ArcMenuPlacement.DTP])
                    menuPlacementCombo.set_active(Constants.ArcMenuPlacement.PANEL);  
                else
                    menuPlacementCombo.set_active(placement);
            }
            else
                menuPlacementCombo.set_active(placement);
            
            menuPositionLeftButton.connect('toggled', () => {
                this._settings.set_enum('position-in-panel', Constants.MENU_POSITION.Left);
                if(menuPlacementFrame.get_index(2) === menuPositionAdjustmentRow)
                    menuPlacementFrame.remove(menuPositionAdjustmentRow);
            });
            menuPositionCenterButton.connect('toggled', () => {
                this._settings.set_enum('position-in-panel', Constants.MENU_POSITION.Center);
                if(menuPlacementFrame.get_index(2) != menuPositionAdjustmentRow){
                    menuPlacementFrame.insert(menuPositionAdjustmentRow, 2);
                    menuPlacementFrame.show();
                }
            });
            menuPositionRightButton.connect('toggled', () => {
                this._settings.set_enum('position-in-panel', Constants.MENU_POSITION.Right);
                if(menuPlacementFrame.get_index(2) === menuPositionAdjustmentRow)
                    menuPlacementFrame.remove(menuPositionAdjustmentRow);
            });
        }
});

var ModifyHotCornerDialogWindow = GObject.registerClass(
    class Arc_Menu_ModifyHotCornerDialogWindow extends PW.DialogWindow {
        _init(settings, parent) {
            this._settings = settings;
            this.addResponse = false;
            super._init(_('Modify Activities Hot Corner'), parent);
            this.set_default_size(600,250);
        }

        _createLayout(vbox) {  
            let modifyHotCornerFrame = new PW.FrameBox();
            let modifyHotCornerRow = new PW.FrameBoxRow();
            let modifyHotCornerLabel = new Gtk.Label({
                label: _("Activities Hot Corner Action"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let hotCornerActionCombo = new Gtk.ComboBoxText({ 
                halign: Gtk.Align.END,
                tooltip_text: _("Choose the action of the Activities Hot Corner") 
            });
            hotCornerActionCombo.append_text(_("GNOME Default"));
            hotCornerActionCombo.append_text(_("Disabled"));
            hotCornerActionCombo.append_text(_("Toggle ArcMenu"));
            hotCornerActionCombo.append_text(_("Custom"));
            
            let customHotCornerFrame = new PW.FrameBox();
            let customHeaderHotCornerRow = new PW.FrameBoxRow();
            
            let customHeaderHotCornerLabel = new Gtk.Label({
                label: "<b>"+_("Custom Activities Hot Corner Action") + "</b>\n" + _("Choose from a list of preset commands or use your own terminal command"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            customHeaderHotCornerLabel.set_sensitive(false);
            customHeaderHotCornerRow.add(customHeaderHotCornerLabel);
            
            let presetCustomHotCornerRow = new PW.FrameBoxRow();
            let presetCustomHotCornerLabel = new Gtk.Label({
                label: _("Preset commands"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let hotCornerPresetsCombo = new Gtk.ComboBoxText({ 
                tooltip_text: _("Choose from a list of preset Activities Hot Corner commands"),
                hexpand: true
            });

            hotCornerPresetsCombo.append_text(_("Show all Applications"));
            hotCornerPresetsCombo.append_text(_("GNOME Terminal"));
            hotCornerPresetsCombo.append_text(_("GNOME System Monitor"));
            hotCornerPresetsCombo.append_text(_("GNOME Calculator"));
            hotCornerPresetsCombo.append_text(_("GNOME gedit"));
            hotCornerPresetsCombo.append_text(_("GNOME Screenshot"));
            hotCornerPresetsCombo.append_text(_("GNOME Weather"));
            hotCornerPresetsCombo.append_text(_("Run Command..."));
            hotCornerPresetsCombo.connect('changed', (widget) => {
                if(widget.get_active() === 0)
                    customHotCornerEntry.set_text("ArcMenu_ShowAllApplications");
                else if(widget.get_active() === 1)
                    customHotCornerEntry.set_text("gnome-terminal");
                else if(widget.get_active() === 2)
                    customHotCornerEntry.set_text("gnome-system-monitor");
                else if(widget.get_active() === 3)
                    customHotCornerEntry.set_text("gnome-calculator");
                else if(widget.get_active() === 4)
                    customHotCornerEntry.set_text("gedit");
                else if(widget.get_active() === 5)
                    customHotCornerEntry.set_text("gnome-screenshot");
                else if(widget.get_active() === 6)
                    customHotCornerEntry.set_text("gnome-weather");
                else if(widget.get_active() === 7)
                    customHotCornerEntry.set_text("ArcMenu_RunCommand");
            });
            presetCustomHotCornerRow.add(presetCustomHotCornerLabel);
            presetCustomHotCornerRow.add(hotCornerPresetsCombo);
            
            let customHotCornerRow = new PW.FrameBoxRow();
            let customHotCornerLabel = new Gtk.Label({
                label: _("Terminal Command"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let customHotCornerEntry = new Gtk.Entry({
                tooltip_text: _("Set a custom terminal command to launch on active hot corner")
            });
            customHotCornerEntry.set_text(this._settings.get_string('custom-hot-corner-cmd'));
            customHotCornerEntry.connect('changed', (widget) => {
                applyButton.set_sensitive(true); 
                let index = this.checkIfMatch(customHotCornerEntry.get_text());
                hotCornerPresetsCombo.set_active(index)
            });
            customHotCornerEntry.set_width_chars(40);
            
            let index = this.checkIfMatch(customHotCornerEntry.get_text());
            hotCornerPresetsCombo.set_active(index)
            customHotCornerRow.add(customHotCornerLabel);
            customHotCornerRow.add(customHotCornerEntry);

            customHotCornerFrame.add(customHeaderHotCornerRow);
            customHotCornerFrame.add(presetCustomHotCornerRow);
            customHotCornerFrame.add(customHotCornerRow);
            
            let applyButton = new Gtk.Button({
                label: _("Apply"),
                hexpand: true,
                tooltip_text: _("Apply changes and set new hot corner action")
            });
            applyButton.connect('clicked', () => {
                this._settings.set_string('custom-hot-corner-cmd',customHotCornerEntry.get_text());
                this._settings.set_enum('hot-corners',hotCornerActionCombo.get_active());
                applyButton.set_sensitive(false);
                this.addResponse = true;
                this.response(-10);
            });
            applyButton.set_halign(Gtk.Align.END);
            applyButton.set_sensitive(false);
           

            let hotCornerAction = this._settings.get_enum('hot-corners');
            hotCornerActionCombo.set_active(hotCornerAction);
            hotCornerActionCombo.connect('changed', (widget) => {
                applyButton.set_sensitive(true);
                if(widget.get_active()==Constants.HOT_CORNERS_ACTION.Custom){
                    customHotCornerFrame.set_sensitive(true);
                }
                else{
                    customHotCornerFrame.set_sensitive(false);
                }
            });

            modifyHotCornerRow.add(modifyHotCornerLabel);
            modifyHotCornerRow.add(hotCornerActionCombo);
            modifyHotCornerFrame.add(modifyHotCornerRow);
            if(hotCornerActionCombo.get_active() == Constants.HOT_CORNERS_ACTION.Custom)
                customHotCornerFrame.set_sensitive(true);
            else
                customHotCornerFrame.set_sensitive(false);
            vbox.append(modifyHotCornerFrame);
            vbox.append(customHotCornerFrame);
            vbox.append(applyButton);
        }
        checkIfMatch(text){
            if(text === "ArcMenu_ShowAllApplications")
                return 0;
            else if(text === "gnome-terminal")
                return 1;
            else if(text === "gnome-system-monitor")
                return 2;
            else if(text === "gnome-calculator")
                return 3;
            else if(text === "gedit")
                return 4;
            else if(text === "gnome-screenshot")
                return 5;
            else if(text === "gnome-weather")
                return 6;
            else if(text === "ArcMenu_RunCommand")
                return 7;
            else
                return -1;
        }
});

var CustomHotkeyDialogWindow = GObject.registerClass(
    class Arc_Menu_CustomHotkeyDialogWindow extends PW.DialogWindow {
        _init(settings, parent) {
            this._settings = settings;
            this.addResponse = false;
            this.keyEventController = new Gtk.EventControllerKey();
            
            super._init(_('Set Custom Hotkey'), parent);
            this.add_controller(this.keyEventController);
            this.set_size_request(500, 250);
        }

        _createLayout(vbox) {
            let hotkeyKey = '';

            let modLabel = new Gtk.Label({
                label:_("Choose Modifiers"),
                use_markup: true,
                hexpand: true,
                halign: Gtk.Align.START
            });
            let modFrame = new PW.FrameBox();
            let modRow = new PW.FrameBoxRow();
            modRow.add(modLabel);

            let buttonBox = new Gtk.Box({
                hexpand: true,
                halign: Gtk.Align.END,
                spacing: 5
            });
            modRow.add(buttonBox);
            let ctrlButton = new Gtk.ToggleButton({
                label: _("Ctrl")
            });   
            let superButton = new Gtk.ToggleButton({
                label: _("Super")
            });   
            let shiftButton = new Gtk.ToggleButton({
                label: _("Shift")
            });   
            let altButton = new Gtk.ToggleButton({
                label: _("Alt")
            });  
            ctrlButton.connect('toggled', () => {
                this.resultsText=""; 
                if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";     
                if(superButton.get_active()) this.resultsText += "<Super>";   
                if(shiftButton.get_active()) this.resultsText += "<Shift>";   
                if(altButton.get_active()) this.resultsText += "<Alt>";  
                this.resultsText += hotkeyKey;   
                resultsWidget.accelerator =  this.resultsText; 
                applyButton.set_sensitive(true);      
            });
            superButton.connect('toggled', () => {
                this.resultsText=""; 
                if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";     
                if(superButton.get_active()) this.resultsText += "<Super>";   
                if(shiftButton.get_active()) this.resultsText += "<Shift>";   
                if(altButton.get_active()) this.resultsText += "<Alt>";  
                this.resultsText += hotkeyKey;   
                resultsWidget.accelerator =  this.resultsText;   
                applyButton.set_sensitive(true);    
            });
            shiftButton.connect('toggled', () => {
                this.resultsText=""; 
                if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";     
                if(superButton.get_active()) this.resultsText += "<Super>";   
                if(shiftButton.get_active()) this.resultsText += "<Shift>";   
                if(altButton.get_active()) this.resultsText += "<Alt>";  
                this.resultsText += hotkeyKey;   
                resultsWidget.accelerator =  this.resultsText; 
                applyButton.set_sensitive(true);      
            });
            altButton.connect('toggled', () => {
                this.resultsText=""; 
                if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";     
                if(superButton.get_active()) this.resultsText += "<Super>";   
                if(shiftButton.get_active()) this.resultsText += "<Shift>";   
                if(altButton.get_active()) this.resultsText += "<Alt>";  
                this.resultsText += hotkeyKey;   
                resultsWidget.accelerator =  this.resultsText;  
                applyButton.set_sensitive(true);     
            });
            buttonBox.append(ctrlButton);
            buttonBox.append(superButton);
            buttonBox.append(shiftButton);
            buttonBox.append(altButton);
            modFrame.add(modRow);
            vbox.append(modFrame);

            let keyFrame = new PW.FrameBox();
            let keyLabel = new Gtk.Label({
                label: _("Press any key"),
                use_markup: true,
                xalign: .5,
                hexpand: true,
                halign: Gtk.Align.CENTER
            });
            vbox.append(keyLabel);
            let pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(Me.path + '/media/icons/prefs_icons/keyboard-symbolic.svg', 256, 72);
            let keyboardImage = Gtk.Picture.new_for_pixbuf(pixbuf);
            keyboardImage.hexpand = true;
            keyboardImage.vexpand = true;
            keyboardImage.halign = Gtk.Align.CENTER;
            keyboardImage.valign = Gtk.Align.CENTER;
            vbox.append(keyboardImage)

            let resultsRow = new PW.FrameBoxRow(); 
            let resultsLabel = new Gtk.Label({
                label: _("New Hotkey"),
                use_markup: true,
                xalign: .5,
                hexpand: false,
                halign: Gtk.Align.START
            });
            let resultsWidget = new Gtk.ShortcutsShortcut({
                hexpand: true,
                halign: Gtk.Align.END
            });
            resultsRow.add(resultsLabel);
            resultsRow.add(resultsWidget);
            keyFrame.add(resultsRow);

            let applyButton = new Gtk.Button({
                label: _("Apply"),
                halign: Gtk.Align.END
            });
            applyButton.connect('clicked', () => {
                this.addResponse = true;
                this.response(-10);
            });
            applyButton.set_sensitive(false);

            this.keyEventController.connect('key-released', (controller, keyval, keycode, state) =>  {
                this.resultsText = "";
                let key = keyval;
                hotkeyKey = Gtk.accelerator_name(key, 0);    
                if(ctrlButton.get_active()) this.resultsText += "<Ctrl>";     
                if(superButton.get_active()) this.resultsText += "<Super>";   
                if(shiftButton.get_active()) this.resultsText += "<Shift>";   
                if(altButton.get_active()) this.resultsText += "<Alt>";  
                this.resultsText += Gtk.accelerator_name(key,0);   
                resultsWidget.accelerator =  this.resultsText;   
                applyButton.set_sensitive(true);  
            });

            vbox.append(keyFrame);
            vbox.append(applyButton);    
        }
});

function getIconPixbuf(filePath){
    if (GLib.file_test(filePath, GLib.FileTest.EXISTS)) 
        return GdkPixbuf.Pixbuf.new_from_file_at_size(filePath, 25, 25);
    else
        return null;
}

var ButtonAppearancePage = GObject.registerClass(
    class Arc_Menu_ButtonAppearancePage extends Gtk.ScrolledWindow {
        _init(settings) {
            super._init();
            this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
    
            this.mainBox = new Gtk.Box({
                    orientation: Gtk.Orientation.VERTICAL,
                    margin_top: 24,
                    margin_bottom: 24,
                    margin_start: 24,
                    margin_end: 24,
                    spacing: 20,
                    vexpand: true,
                    valign: Gtk.Align.FILL
            });
    
            this.set_child(this.mainBox);
            this._settings = settings;
            this.menuButtonColor = this._settings.get_string('menu-button-color');
            this.menuButtonHoverColor = this._settings.get_string('menu-button-hover-color');
            this.menuButtonActiveColor = this._settings.get_string('menu-button-active-color');
            this.menuButtonHoverBackgroundcolor = this._settings.get_string('menu-button-hover-backgroundcolor');
            this.menuButtonActiveBackgroundcolor = this._settings.get_string('menu-button-active-backgroundcolor');
            this._createLayout(this.mainBox);
        }

        _createLayout(vbox) {
            let menuButtonAppearanceHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Menu Button Appearance') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.mainBox.append(menuButtonAppearanceHeaderLabel);

            let menuButtonAppearanceFrame = new PW.FrameBox();
            let menuButtonAppearanceRow = new PW.FrameBoxRow();
            let menuButtonAppearanceLabel = new Gtk.Label({
                label: _('Appearance'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let menuButtonAppearanceCombo = new Gtk.ComboBoxText({ halign: Gtk.Align.END });
            menuButtonAppearanceCombo.append_text(_("Icon"));
            menuButtonAppearanceCombo.append_text(_("Text"));
            menuButtonAppearanceCombo.append_text(_("Icon and Text"));
            menuButtonAppearanceCombo.append_text(_("Text and Icon"));
            menuButtonAppearanceCombo.append_text(_("Hidden"));
            menuButtonAppearanceCombo.set_active(this._settings.get_enum('menu-button-appearance'));
            menuButtonAppearanceCombo.connect('changed', (widget) => {
                this.resetButton.set_sensitive(true); 
                menuButtonAppearanceFrame.removeChildrenAfterIndex(0);
                if(widget.get_active() === Constants.MENU_APPEARANCE.None){
                    menuButtonAppearanceFrame.show();
                }
                else if(widget.get_active() === Constants.MENU_APPEARANCE.Icon){
                    menuButtonAppearanceFrame.add(menuButtonArrowIconBoxRow);
                    menuButtonAppearanceFrame.add(menuButtonPaddingRow);
                    menuButtonAppearanceFrame.show();
                }
                else if(widget.get_active() === Constants.MENU_APPEARANCE.Icon_Text || widget.get_active() === Constants.MENU_APPEARANCE.Text_Icon ||
                        widget.get_active() === Constants.MENU_APPEARANCE.Text){
                    menuButtonAppearanceFrame.add(menuButtonArrowIconBoxRow);
                    menuButtonAppearanceFrame.add(menuButtonPaddingRow);
                    menuButtonAppearanceFrame.add(menuButtonCustomTextBoxRow);
                    menuButtonAppearanceFrame.show();
                }
                this._settings.set_enum('menu-button-appearance', widget.get_active());
            });
            
            menuButtonAppearanceRow.add(menuButtonAppearanceLabel);
            menuButtonAppearanceRow.add(menuButtonAppearanceCombo);
            menuButtonAppearanceFrame.add(menuButtonAppearanceRow);

            let menuButtonArrowIconBoxRow = new PW.FrameBoxRow();
            let menuButtonArrowIconLabel = new Gtk.Label({
                label: _('Show Arrow'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let enableArrowIconSwitch = new Gtk.Switch({ halign: Gtk.Align.END });
            enableArrowIconSwitch.set_active(this._settings.get_boolean('enable-menu-button-arrow'));
            enableArrowIconSwitch.connect('notify::active', (widget) => {
                this._settings.set_boolean('enable-menu-button-arrow', widget.get_active());
                this.resetButton.set_sensitive(true);  
            });

            menuButtonArrowIconBoxRow.add(menuButtonArrowIconLabel);
            menuButtonArrowIconBoxRow.add(enableArrowIconSwitch);
            if(menuButtonAppearanceCombo.get_active() !== Constants.MENU_APPEARANCE.None)
                menuButtonAppearanceFrame.add(menuButtonArrowIconBoxRow);

            let menuButtonPaddingRow = new PW.FrameBoxRow();
            let menuButtonPadding = this._settings.get_int('button-padding');
            let menuButtonPaddingLabel = new Gtk.Label({
                label: _('Menu Button Padding'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let paddingScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({
                    lower: -1,
                    upper: 25,
                    step_increment: 1,
                    page_increment: 1,
                    page_size: 0
                }),
                digits: 0,
                round_digits: 0,
                hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            paddingScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
            paddingScale.add_mark(-1, Gtk.PositionType.TOP, _("Default"));
            paddingScale.set_value(menuButtonPadding);
            paddingScale.connect('value-changed', () => {
                this.resetButton.set_sensitive(true); 
                this._settings.set_int('button-padding', paddingScale.get_value());
                this._settings.set_boolean('reload-theme', true);
            });
            let menuButtonPaddingInfoButton = new PW.Button({
                icon_name: 'info-circle-symbolic'
            });
            menuButtonPaddingInfoButton.connect('clicked', ()=> {
                let dialog = new PW.MessageDialog({
                    text: _("Change the padding of the Menu Button"),
                    secondaryText: _("You may need to hover over the Menu Button for the changes to take effect."),
                    buttons: Gtk.ButtonsType.OK,
                    transient_for: this.get_root()
                });
                dialog.connect ('response', ()=> dialog.destroy());
                dialog.show();
            });

            menuButtonPaddingRow.add(menuButtonPaddingLabel);
            menuButtonPaddingRow.add(paddingScale);
            menuButtonPaddingRow.add(menuButtonPaddingInfoButton);
            if(menuButtonAppearanceCombo.get_active() !== Constants.MENU_APPEARANCE.None)
                menuButtonAppearanceFrame.add(menuButtonPaddingRow);

            let menuButtonCustomTextBoxRow = new PW.FrameBoxRow();
            let menuButtonCustomTextLabel = new Gtk.Label({
                label: _('Text'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let menuButtonCustomTextEntry = new Gtk.Entry({ halign: Gtk.Align.END });
            menuButtonCustomTextEntry.set_width_chars(30);
            menuButtonCustomTextEntry.set_text(this._settings.get_string('custom-menu-button-text'));
            menuButtonCustomTextEntry.connect('changed', (widget) => {
                this.resetButton.set_sensitive(true); 
                let customMenuButtonText = widget.get_text();
                this._settings.set_string('custom-menu-button-text', customMenuButtonText);
            });

            menuButtonCustomTextBoxRow.add(menuButtonCustomTextLabel);
            menuButtonCustomTextBoxRow.add(menuButtonCustomTextEntry);
            if(this._settings.get_enum('menu-button-appearance') != Constants.MENU_APPEARANCE.Icon && this._settings.get_enum('menu-button-appearance') != Constants.MENU_APPEARANCE.None)
                menuButtonAppearanceFrame.add(menuButtonCustomTextBoxRow);
            vbox.append(menuButtonAppearanceFrame);

            let menuButtonIconHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Icon Appearance') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.mainBox.append(menuButtonIconHeaderLabel);    

            let menuButtonIconFrame = new PW.FrameBox();
            let menuButtonIconRow = new PW.FrameBoxRow();
            let menuButtonIconLabel = new Gtk.Label({
                label: _('Icon'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            
            let menuButtonIconButton = new PW.Button({
                title: _("Browse Icons") + " ",
                icon_name: 'icon-preview-symbolic',
                hexpand: false,
                tooltip_text: _("Choose from a variety of icons")
            });
            menuButtonIconButton.connect('clicked', () => {
                let dialog = new ArcMenuIconsDialogWindow(this._settings, this);
                dialog.show();
                dialog.connect('response', ()=> {
                    this.resetButton.set_sensitive(this.checkIfResetButtonSensitive());
                    dialog.destroy();
                }); 
            });

            menuButtonIconRow.add(menuButtonIconLabel);
            menuButtonIconRow.add(menuButtonIconButton);
            menuButtonIconFrame.add(menuButtonIconRow);
            
            let menuButtonIconSizeRow = new PW.FrameBoxRow();
            let iconSize = this._settings.get_double('custom-menu-button-icon-size');
            let menuButtonIconSizeLabel = new Gtk.Label({
                label: _('Icon Size'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let menuButtonIconSizeScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({
                    lower: 14,
                    upper: 64,
                    step_increment: 1,
                    page_increment: 1,
                    page_size: 0
                }),
                digits: 0,
                round_digits: 0,
                hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            menuButtonIconSizeScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
            menuButtonIconSizeScale.set_value(iconSize);
            menuButtonIconSizeScale.connect('value-changed', () => {
                this.resetButton.set_sensitive(true); 
                this._settings.set_double('custom-menu-button-icon-size', menuButtonIconSizeScale.get_value());
            });

            menuButtonIconSizeRow.add(menuButtonIconSizeLabel);
            menuButtonIconSizeRow.add(menuButtonIconSizeScale);
            menuButtonIconFrame.add(menuButtonIconSizeRow);

            vbox.append(menuButtonIconFrame);

            this.resetButton = new Gtk.Button({
                label: _("Restore Defaults"),
                tooltip_text: _("Restore the default settings on this page"),
                halign: Gtk.Align.START,
                hexpand: true,
                valign: Gtk.Align.END,
                vexpand: true
            });

            let menuButtonColorHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Menu Button Styling') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.mainBox.append(menuButtonColorHeaderLabel);

            this.menuButtonIconColorFrame = new PW.FrameBox();

            let[menuButtonColorSwitch, menuButtonColorChooser] = this.newColorChooserRow({
                color: this.menuButtonColor,
                label: _("Color"),
                settingColorName: 'menu-button-color',
                settingOverrideName: 'override-menu-button-color',
            });
            
            let[menuButtonHoverColorSwitch, menuButtonHoverColorChooser] = this.newColorChooserRow({
                color: this.menuButtonHoverColor,
                label: _("Hover Color"),
                settingColorName: 'menu-button-hover-color',
                settingOverrideName: 'override-menu-button-hover-color',
            });

            let[menuButtonActiveColorSwitch, menuButtonActiveColorChooser] = this.newColorChooserRow({
                color: this.menuButtonActiveColor,
                label: _("Active Color"),
                settingColorName: 'menu-button-active-color',
                settingOverrideName: 'override-menu-button-active-color',
            });

            let[menuButtonHoverBackgroundcolorSwitch, menuButtonHoverBackgroundcolorChooser] = this.newColorChooserRow({
                color: this.menuButtonHoverBackgroundcolor,
                label: _("Hover Background Color"),
                settingColorName: 'menu-button-hover-backgroundcolor',
                settingOverrideName: 'override-menu-button-hover-background-color',
            });

            let[menuButtonActiveBackgroundcolorSwitch, menuButtonActiveBackgroundcolorChooser] = this.newColorChooserRow({
                color: this.menuButtonActiveBackgroundcolor,
                label: _("Active Background Color"),
                settingColorName: 'menu-button-active-backgroundcolor',
                settingOverrideName: 'override-menu-button-active-background-color',
            });

            let roundedCornersRow = new PW.FrameBoxRow();
        
            let roundedCornersLabel = new Gtk.Label({
                label: _("Disable Rounded Corners"),
                xalign:0,
                hexpand: true,
            });
            let roundedCornersSwitch = new Gtk.Switch({ 
                halign: Gtk.Align.END,
                valign: Gtk.Align.CENTER,
                active: this._settings.get_boolean('menu-button-disable-rounded-corners')
            });
            roundedCornersSwitch.connect("notify::active", (widget)=> {
                this.resetButton.set_sensitive(true);
                this._settings.set_boolean('menu-button-disable-rounded-corners', widget.get_active())
                this._settings.set_boolean('reload-theme', true);
            });

            roundedCornersRow.add(roundedCornersLabel);
            roundedCornersRow.add(roundedCornersSwitch);

            this.menuButtonIconColorFrame.add(roundedCornersRow);

            vbox.append(this.menuButtonIconColorFrame);

            this.resetButton.set_sensitive(this.checkIfResetButtonSensitive());
            this.resetButton.connect('clicked', ()=> {
                menuButtonAppearanceCombo.set_active(0);
                menuButtonCustomTextEntry.set_text('Applications');
                paddingScale.set_value(-1);
                menuButtonIconSizeScale.set_value(20);
                let colorParse = new Gdk.RGBA();
                colorParse.parse('rgb(240,240,240)');
                menuButtonActiveColorChooser.set_rgba(colorParse);
                menuButtonColorChooser.set_rgba(colorParse);
                colorParse.parse('rgb(214,214,214)');
                menuButtonHoverColorChooser.set_rgba(colorParse);
                colorParse.parse('rgba(238,238,236,0.1)');
                menuButtonHoverBackgroundcolorChooser.set_rgba(colorParse);
                colorParse.parse('rgba(238,238,236,0.18)');
                menuButtonActiveBackgroundcolorChooser.set_rgba(colorParse);
                enableArrowIconSwitch.set_active(false);
                menuButtonColorSwitch.set_active(false);
                menuButtonHoverColorSwitch.set_active(false);
                menuButtonActiveColorSwitch.set_active(false);
                menuButtonHoverBackgroundcolorSwitch.set_active(false);
                menuButtonActiveBackgroundcolorSwitch.set_active(false);
                roundedCornersSwitch.set_active(false);
                this._settings.reset('menu-button-icon');
                this._settings.reset('arc-menu-icon');
                this._settings.reset('distro-icon');
                this._settings.reset('custom-menu-button-icon');
                this._settings.reset('menu-button-hover-color');
                this._settings.reset('menu-button-active-color');
                this._settings.reset('menu-button-hover-backgroundcolor');
                this._settings.reset('menu-button-active-backgroundcolor');
                this._settings.reset('menu-button-color');
                this._settings.reset('override-menu-button-hover-color');
                this._settings.reset('override-menu-button-active-color');
                this._settings.reset('override-menu-button-hover-background-color');
                this._settings.reset('override-menu-button-active-background-color');
                this._settings.reset('override-menu-button-color');
                this._settings.reset('menu-button-disable-rounded-corners');
                this._settings.set_boolean('reload-theme', true);
  
                this.resetButton.set_sensitive(false);        
            });
            vbox.append(this.resetButton);
        }

        newColorChooserRow(params){
            let colorParse = new Gdk.RGBA();
            let colorRow = new PW.FrameBoxRow();
            let buttonsGrid = new Gtk.Grid({
                margin_top: 0,
                margin_bottom: 0,
                vexpand: false,
                hexpand: false,
                column_spacing: 10
            });
            
            let colorLabel = new Gtk.Label({
                label: params.label,
                xalign:0,
                hexpand: true,
            });
            let colorSwitch = new Gtk.Switch({ 
                halign: Gtk.Align.END,
                valign: Gtk.Align.CENTER,
                tooltip_text: _("Override Theme Color"),
                active: this._settings.get_boolean(params.settingOverrideName)
            });
            colorSwitch.connect("notify::active", (widget)=> {
                this.resetButton.set_sensitive(true);
                this._settings.set_boolean(params.settingOverrideName, widget.get_active())
                colorChooser.sensitive = widget.get_active();
                this._settings.set_boolean('reload-theme', true);
            });

            let colorChooser = new Gtk.ColorButton({
                use_alpha: true,
                sensitive: colorSwitch.get_active()
            });  

            colorParse.parse(params.color);
            colorChooser.set_rgba(colorParse);  

            colorChooser.connect('color-set', ()=>{
                this.resetButton.set_sensitive(true); 
                params.color = colorChooser.get_rgba().to_string();
                this._settings.set_string(params.settingColorName, params.color);
                this._settings.set_boolean('reload-theme', true);
            });

            colorRow.add(colorLabel);
            buttonsGrid.attach(colorSwitch, 0, 0, 1, 1);
            buttonsGrid.attach(Gtk.Separator.new(Gtk.Orientation.VERTICAL), 1, 0, 1, 1);
            buttonsGrid.attach(colorChooser, 2, 0, 1, 1);
            colorRow.add(buttonsGrid);
            this.menuButtonIconColorFrame.add(colorRow);
            return [colorSwitch, colorChooser];
        }

        checkIfResetButtonSensitive(){
           if(  this._settings.get_string('menu-button-hover-backgroundcolor') != 'rgba(238,238,236,0.1)' ||  
                this._settings.get_string('menu-button-active-backgroundcolor') != 'rgba(238,238,236,0.18)' || 
                this._settings.get_string('menu-button-active-color') != 'rgb(240,240,240)' ||
                this._settings.get_string('menu-button-hover-color') != 'rgb(214,214,214)' ||
                this._settings.get_string('menu-button-color') != 'rgb(240,240,240)' ||
                this._settings.get_double('custom-menu-button-icon-size') != 20 ||
                this._settings.get_int('button-padding') != -1 ||
                this._settings.get_enum('menu-button-icon') != 0 ||
                this._settings.get_int('arc-menu-icon') != 0 ||
                this._settings.get_string('custom-menu-button-text') != 'Applications' ||
                this._settings.get_enum('menu-button-appearance') != 0 ||
                this._settings.get_boolean('enable-menu-button-arrow') || 
                this._settings.get_boolean('override-menu-button-color') ||
                this._settings.get_boolean('override-menu-button-hover-color') ||
                this._settings.get_boolean('override-menu-button-active-color') ||
                this._settings.get_boolean('override-menu-button-hover-background-color') ||
                this._settings.get_boolean('override-menu-button-active-background-color') ||
                this._settings.get_boolean('menu-button-disable-rounded-corners'))
                    return true;
            else
                return false;
        }
});

var ArcMenuIconsDialogWindow = GObject.registerClass(
    class Arc_Menu_ArcMenuIconsDialogWindow extends PW.DialogWindow {
        _init(settings, parent) {
            this._settings = settings;
            this.customIconPath = this._settings.get_string('custom-menu-button-icon');
            super._init(_('ArcMenu Icons'), parent);
            this.set_default_size(550, 400);
        }

        _createLayout(vbox){
            this.stack = new Gtk.Stack({
                halign: Gtk.Align.FILL, 
                hexpand: true,
                transition_type: Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
            });

            let arcMenuIconsBox = new Gtk.ScrolledWindow();

            let arcMenuIconsFlowBox = new PW.IconGrid();
            arcMenuIconsFlowBox.connect('child-activated', ()=> {
                let selectedChild = arcMenuIconsFlowBox.get_selected_children();
                let selectedChildIndex = selectedChild[0].get_index();
                this._settings.set_enum('menu-button-icon', Constants.MENU_BUTTON_ICON.Arc_Menu);
                this._settings.set_int('arc-menu-icon', selectedChildIndex);
            });
            arcMenuIconsBox.set_child(arcMenuIconsFlowBox);
            Constants.MENU_ICONS.forEach((icon)=>{
                let iconName = icon.path.replace("/media/icons/menu_button_icons/icons/", '');
                iconName = iconName.replace(".svg", '');
                let iconImage = new Gtk.Image({
                    icon_name: iconName,
                    pixel_size: 36
                });
                arcMenuIconsFlowBox.add(iconImage);
            });

            let distroIconsBox = new PW.IconGrid();
            distroIconsBox.connect('child-activated', ()=> {
                let selectedChild = distroIconsBox.get_selected_children();
                let selectedChildIndex = selectedChild[0].get_index();
                this._settings.set_enum('menu-button-icon', Constants.MENU_BUTTON_ICON.Distro_Icon);
                this._settings.set_int('distro-icon', selectedChildIndex);
            });
            Constants.DISTRO_ICONS.forEach((icon)=>{
                let iconImage;
                if(icon.path === 'start-here-symbolic'){
                    iconImage = new Gtk.Image({
                        icon_name: 'start-here-symbolic',
                        pixel_size: 36
                    });
                }
                else{
                    let iconName1 = icon.path.replace("/media/icons/menu_button_icons/distro_icons/", '');
                    iconName1 = iconName1.replace(".svg", '');
                    iconImage = new Gtk.Image({
                        icon_name: iconName1,
                        pixel_size: 36
                    });
                }
                distroIconsBox.add(iconImage);
            });

            let customIconBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL
            });
            let customIconFlowBox = new PW.IconGrid();
            customIconFlowBox.vexpand = false;
            customIconFlowBox.homogeneous = false;
            customIconFlowBox.connect('child-activated', ()=> {
                let customIconPath = dialog.get_file() ? dialog.get_file().get_path() : '';
                this._settings.set_string('custom-menu-button-icon', customIconPath)
                this._settings.set_enum('menu-button-icon', Constants.MENU_BUTTON_ICON.Custom);
            });
            customIconBox.append(customIconFlowBox);
            let customIconImage = new Gtk.Image({
                gicon: Gio.icon_new_for_string(this._settings.get_string('custom-menu-button-icon')),
                pixel_size: 36
            });
            customIconFlowBox.add(customIconImage);
            
            let fileChooserFrame = new PW.FrameBox();
            fileChooserFrame.margin_top = 20;
            fileChooserFrame.margin_bottom = 20;
            fileChooserFrame.margin_start = 20;
            fileChooserFrame.margin_end = 20;
            let fileChooserRow = new PW.FrameBoxRow();
            let fileChooserLabel = new Gtk.Label({
                label: _('Browse for a Custom Icon'),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let dialog = new Gtk.FileChooserDialog({ 
                title: _('Select an Icon'),
                transient_for: this.get_root(), 
                modal: true,
                action: Gtk.FileChooserAction.OPEN,
            });
            let fileFilter = new Gtk.FileFilter();
            fileFilter.add_pixbuf_formats();
            let fileChooserButton = new Gtk.Button({
                label: _('Select an Icon')
            });
            fileChooserButton.connect('clicked', (widget) => {
                let dialog = new Gtk.FileChooserDialog({ 
                    title: _('Select an Icon'),
                    transient_for: this.get_root(), 
                    modal: true,
                    action: Gtk.FileChooserAction.OPEN,
                });

                if(dialog.get_parent())
                    dialog.unparent();
                dialog.set_filter(fileFilter);    

                dialog.add_button("_Cancel", Gtk.ResponseType.CANCEL);
                dialog.add_button("_Open", Gtk.ResponseType.ACCEPT);
        
                dialog.connect("response", (self, response) => {
                    if(response === Gtk.ResponseType.ACCEPT){
                        customIconImage.gicon = Gio.icon_new_for_string(dialog.get_file().get_path());
                        this._settings.set_string('custom-menu-button-icon', dialog.get_file().get_path());
                        this._settings.set_enum('menu-button-icon', Constants.MENU_BUTTON_ICON.Custom);
                        customIconFlowBox.select_child(customIconFlowBox.get_child_at_index(0));
                        dialog.destroy();
                    }
                    else
                        dialog.destroy();
                })

                dialog.show();
            });
    
            fileChooserRow.add(fileChooserLabel);
            fileChooserRow.add(fileChooserButton);
            fileChooserFrame.add(fileChooserRow);
            customIconBox.append(fileChooserFrame);
            if(GLib.file_test(this.customIconPath, GLib.FileTest.IS_REGULAR))
                dialog.set_file(Gio.file_new_for_path(this.customIconPath));
            
            this.stack.add_titled(arcMenuIconsBox, 'ArcMenu Icons', _('ArcMenu Icons'));
            this.stack.add_titled(distroIconsBox, 'Distro Icons', _('Distro Icons'));
            this.stack.add_titled(customIconBox, 'Custom Icon', _('Custom Icon'));

            let stackSwitcher = new Gtk.StackSwitcher({
                stack: this.stack,
                halign: Gtk.Align.CENTER
            });

            vbox.append(stackSwitcher);
            vbox.append(this.stack);           
            if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Arc_Menu)
                this.stack.set_visible_child_name('ArcMenu Icons');
            else if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Distro_Icon)
                this.stack.set_visible_child_name('Distro Icons');
            else if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Custom)
                this.stack.set_visible_child_name('Custom Icon');
            
            if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Arc_Menu){
                let children = arcMenuIconsFlowBox.childrenCount;
                for(let i = 0; i < children; i++){
                    if(i === this._settings.get_int('arc-menu-icon')){
                        arcMenuIconsFlowBox.select_child(arcMenuIconsFlowBox.get_child_at_index(i));
                        break;
                    }
                }
            }
            else if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Distro_Icon){
                let children = distroIconsBox.childrenCount;
                for(let i = 0; i < children; i++){
                    if(i === this._settings.get_int('distro-icon')){
                        distroIconsBox.select_child(distroIconsBox.get_child_at_index(i));
                        break;
                    }
                }
            }
            else if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Custom){
                customIconFlowBox.select_child(customIconFlowBox.get_child_at_index(0));
            }

            let distroInfoButton = new PW.Button({
                icon_name: 'info-circle-symbolic'
            });
            distroInfoButton.halign = Gtk.Align.START;
            distroInfoButton.connect('clicked', ()=> {
                let dialog = new DistroIconsDisclaimerWindow(this._settings, this);
                dialog.connect ('response', ()=> dialog.destroy());
                dialog.show();
            });
            vbox.append(distroInfoButton);
        }

        setVisibleChild(){
            if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Arc_Menu)
                this.stack.set_visible_child_name('ArcMenu Icons');
            else if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Distro_Icon)
                this.stack.set_visible_child_name('Distro Icons');
            else if(this._settings.get_enum('menu-button-icon') === Constants.MENU_BUTTON_ICON.Custom)
                this.stack.set_visible_child_name('Custom Icon');
        }
});

var DistroIconsDisclaimerWindow = GObject.registerClass(
    class Arc_Menu_DistroIconsDisclaimerWindow extends Gtk.MessageDialog {
        _init(settings, parent) {
            this._settings = settings;
            super._init({
                text: "<b>" + _("Legal disclaimer for Distro Icons...") + "</b>",
                use_markup: true,
                message_type: Gtk.MessageType.OTHER,
                transient_for: parent.get_root(),
                modal: true,
                buttons: Gtk.ButtonsType.OK
            });
            
            let vbox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 20,
                homogeneous: false,
                margin_top: 5,
                margin_bottom: 5,
                margin_start: 5,
                margin_end: 5,
            });
            this.get_content_area().append(vbox);
            this._createLayout(vbox);
        }

        _createLayout(vbox) {         
            let scrollWindow = new Gtk.ScrolledWindow({
                min_content_width: 500,
                max_content_width: 500,
                min_content_height: 400,
                max_content_height: 400,
                hexpand: false,
                halign: Gtk.Align.START,
            });
            scrollWindow.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
            let frame = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                hexpand: false,
                halign: Gtk.Align.START
            });
           
            let bodyLabel = new Gtk.Label({
                label: Constants.DistroIconsDisclaimer,
                use_markup: true,
                hexpand: false,
                halign: Gtk.Align.START,
                wrap: true
            });
            bodyLabel.set_size_request(500,-1);
    
            frame.append(bodyLabel);
            scrollWindow.set_child(frame);
            vbox.append(scrollWindow);
        }
});

var MenuLayoutPage = GObject.registerClass(
    class Arc_Menu_MenuLayoutPage extends Gtk.Box {
        _init(settings) {
            super._init({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
            });
            this._settings = settings;
            
            this.scrollBox = new Gtk.ScrolledWindow({
                vexpand: true,
                valign: Gtk.Align.FILL
            });
            this.scrollBox.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
            
            this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 20,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                vexpand: true,
                valign: Gtk.Align.FILL
            })
            this.scrollBox.set_child(this.mainBox);

            let currentLayoutLabout = new Gtk.Label({
                label: "<b>" + _("Current Menu Layout") + "</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let chooseNewLayoutLabel = new Gtk.Label({
                label: "<b>" + _("Choose New Layout") + "</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.mainBox.append(currentLayoutLabout);

            let currentLayoutFrame = new PW.FrameBox();

            let currentLayoutBoxLabel = new Gtk.Label({
                label: "<b>" + this.getMenuLayoutName(this._settings.get_enum('menu-layout')) + "</b>",
                use_markup: true,
                hexpand: true,
                vexpand: false,
                halign: Gtk.Align.CENTER,
                valign: Gtk.Align.CENTER
            });
            let currentLayoutBoxRow = new PW.FrameBoxRow({
                selectable: false,
                activatable: false
            });
            currentLayoutBoxRow._grid.row_spacing = 0;
            
            let menuTweaksButtonImage = new Gtk.Image({
                icon_name: 'emblem-system-symbolic',
                halign: Gtk.Align.CENTER
            });
            let menuTweaksButton = new Gtk.Button({
                child: menuTweaksButtonImage,
                halign: Gtk.Align.END,
                valign: Gtk.Align.CENTER,
                hexpand: false,
                vexpand: false,
                tooltip_text: _("Tweaks for the current menu layout"),
            });
            menuTweaksButton.connect('clicked', () => {
                let dialog = new LayoutTweaks.tweaks.TweaksDialog(this._settings, this, this.getMenuLayoutTweaksName(this._settings.get_enum('menu-layout')));
                dialog.show();
                dialog.connect('response', () => { 
                    dialog.destroy();
                }); 
            });
            let currentLayoutThumbnailPath = this.getMenuLayoutThumbnailPath(this._settings.get_enum('menu-layout'));
            
            let currentLayoutImage = new Gtk.Image({
                gicon: Gio.icon_new_for_string(Me.path + currentLayoutThumbnailPath),
                pixel_size: 95,
                halign: Gtk.Align.START,
                valign: Gtk.Align.CENTER,
            });
            let tweaksLabel = new Gtk.Label({
                label: this.getMenuLayoutTweaksName(this._settings.get_enum('menu-layout')),
                use_markup: true,
                halign: Gtk.Align.END,
                valign: Gtk.Align.CENTER,
                hexpand: true
            }); 
            currentLayoutBoxRow.add(currentLayoutImage);
            currentLayoutBoxRow.add(currentLayoutBoxLabel);
            currentLayoutBoxRow.add(menuTweaksButton);
            currentLayoutFrame.add(currentLayoutBoxRow);

            this.mainBox.append(currentLayoutFrame);
            this.mainBox.append(chooseNewLayoutLabel);

            this.stack = new Gtk.Stack({
                hhomogeneous: true,
                transition_type: Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
            });

            this.stack.add_named(this.scrollBox, "LayoutsBox");
            Constants.MENU_STYLES.Styles.forEach((style) => {
                let tile = new PW.LayoutTile(style.name, Me.path + style.thumbnail, style);
                this.mainBox.append(tile);
                let menuLayoutsBox = new MenuLayoutsDialog(this._settings, this, tile, style.name);
                menuLayoutsBox.connect('menu-layout-response', (dialog, response) => { 
                    if(response === -10) {
                        this._settings.set_enum('menu-layout', dialog.index);
                        this._settings.set_boolean('reload-theme', true);
                        currentLayoutBoxLabel.label = "<b>" + this.getMenuLayoutName(dialog.index) + "</b>";
                        tweaksLabel.label = this.getMenuLayoutTweaksName(dialog.index);
                        currentLayoutImage.gicon = Gio.icon_new_for_string(Me.path + this.getMenuLayoutThumbnailPath(dialog.index));
                        this.stack.set_visible_child_name("LayoutsBox");
                        this.scrollBox.vadjustment.set_value(this.scrollBox.vadjustment.get_lower());
                    }
                    if(response === -20){
                        this.stack.set_visible_child_name("LayoutsBox");
                    }
                }); 
                this.stack.add_named(menuLayoutsBox, "Layout_" + style.name);
                tile._listBox.connect('row-activated', ()=> {
                    this.stack.set_visible_child_name("Layout_" + style.name);
                    menuLayoutsBox.enableSelectionMode();
                });
                
            });
            
            this.append(this.stack);         
    }

    getMenuLayoutName(index){
        for(let styles of Constants.MENU_STYLES.Styles){
            for(let style of styles.layoutStyle){
                if(style.layout == index){
                    return _(style.name);
                }
            }
        }
    }

    getMenuLayoutTweaksName(index){
        for(let styles of Constants.MENU_STYLES.Styles){
            for(let style of styles.layoutStyle){
                if(style.layout == index){
                    return _(style.tweaksName);
                }
            }
        }
    }

    getMenuLayoutThumbnailPath(index){
        for(let styles of Constants.MENU_STYLES.Styles){
            for(let style of styles.layoutStyle){
                if(style.layout == index){
                    return style.thumbnail;
                }
            }
        }
    }
        
});

var MenuThemePage = GObject.registerClass(
    class Arc_Menu_MenuThemePage extends Gtk.ScrolledWindow {
        _init(settings) {
            super._init();
            this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
    
            this.mainBox = new Gtk.Box({
                    orientation: Gtk.Orientation.VERTICAL,
                    margin_top: 24,
                    margin_bottom: 24,
                    margin_start: 24,
                    margin_end: 24,
                    spacing: 20,
                    vexpand: true,
                    valign: Gtk.Align.FILL
            });
    
            this.set_child(this.mainBox);
            this._settings = settings;
            this.separatorColor = this._settings.get_string('separator-color');
            this.verticalSeparator = this._settings.get_boolean('vert-separator');
            this.customArcMenu = this._settings.get_boolean('enable-custom-arc-menu');
            this.menuColor = this._settings.get_string('menu-color');
            this.menuForegroundColor = this._settings.get_string('menu-foreground-color');
            this.borderColor = this._settings.get_string('border-color');
            this.highlightColor = this._settings.get_string('highlight-color');
            this.highlightForegroundColor = this._settings.get_string('highlight-foreground-color');
            this.fontSize = this._settings.get_int('menu-font-size');
            this.borderSize = this._settings.get_int('menu-border-size');
            this.cornerRadius = this._settings.get_int('menu-corner-radius');
            this.menuMargin = this._settings.get_int('menu-margin');
            this.menuArrowSize = this._settings.get_int('menu-arrow-size');
            this.checkIfPresetMatch();

            let overrideArcMenuHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Enable Custom Menu Theme') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.mainBox.append(overrideArcMenuHeaderLabel);

            let overrideArcMenuFrame = new PW.FrameBox();
            let overrideArcMenuRow = new PW.FrameBoxRow();
            let overrideArcMenuLabel = new Gtk.Label({
                label: _("Override Menu Theme"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            let overrideArcMenuSwitch = new Gtk.Switch({ 
                halign: Gtk.Align.END,
                valign: Gtk.Align.CENTER,
                tooltip_text: _("Override the ArcMenu extension theme")
            });
            overrideArcMenuSwitch.set_active(this._settings.get_boolean('enable-custom-arc-menu'));
            overrideArcMenuSwitch.connect('notify::active', (widget) => {
                this._settings.set_boolean('enable-custom-arc-menu',widget.get_active());
                this._settings.set_boolean('reload-theme', true);
                if(widget.get_active()){
                    this.mainBox.append(this.menuThemeCustomizationBox);
                    this.menuThemeCustomizationBox.show();
                }
                else
                    this.mainBox.remove(this.menuThemeCustomizationBox);
                this.mainBox.show();
            });

            this.menuThemeCustomizationBox = new OverrideArcMenuThemeWindow(this._settings, this.mainBox);
            this.menuThemeCustomizationBox.connect('menu-theme-response', (dialog, response) => {
                if(response === -10) {
                    this._settings.set_string('separator-color', dialog.separatorColor);
                    this._settings.set_boolean('vert-separator', dialog.verticalSeparator);
                    this._settings.set_string('menu-color', dialog.menuColor);
                    this._settings.set_string('menu-foreground-color', dialog.menuForegroundColor);
                    this._settings.set_string('border-color', dialog.borderColor);
                    this._settings.set_string('highlight-color', dialog.highlightColor );
                    this._settings.set_string('highlight-foreground-color', dialog.highlightForegroundColor);
                    this._settings.set_int('menu-font-size', dialog.fontSize);
                    this._settings.set_int('menu-border-size', dialog.borderSize);
                    this._settings.set_int('menu-corner-radius', dialog.cornerRadius);
                    this._settings.set_int('menu-margin', dialog.menuMargin);
                    this._settings.set_int('menu-arrow-size', dialog.menuArrowSize);
                    this._settings.set_boolean('reload-theme', true);
                    this.presetName = dialog.presetName;
                }
                else{
                    this.checkIfPresetMatch();
                }   
            }); 
            

            overrideArcMenuRow.add(overrideArcMenuLabel);
            overrideArcMenuRow.add(overrideArcMenuSwitch);
            overrideArcMenuFrame.add(overrideArcMenuRow);

            this.mainBox.append(overrideArcMenuFrame);
            if(overrideArcMenuSwitch.get_active())
                this.mainBox.append(this.menuThemeCustomizationBox);
        }

        checkIfPresetMatch(){
            this.presetName = "Custom Theme";
            this.separatorColor = this._settings.get_string('separator-color');
            this.verticalSeparator = this._settings.get_boolean('vert-separator');
            this.menuColor = this._settings.get_string('menu-color');
            this.menuForegroundColor = this._settings.get_string('menu-foreground-color');
            this.borderColor = this._settings.get_string('border-color');
            this.highlightColor = this._settings.get_string('highlight-color');
            this.highlightForegroundColor = this._settings.get_string('highlight-foreground-color');
            this.fontSize = this._settings.get_int('menu-font-size');
            this.borderSize = this._settings.get_int('menu-border-size');
            this.cornerRadius = this._settings.get_int('menu-corner-radius');
            this.menuMargin = this._settings.get_int('menu-margin');
            this.menuArrowSize = this._settings.get_int('menu-arrow-size');
            this.currentSettingsArray = [this.menuColor, this.menuForegroundColor, this.borderColor, this.highlightColor, this.highlightForegroundColor, this.separatorColor, 
                                        this.fontSize.toString(), this.borderSize.toString(), this.cornerRadius.toString(), this.menuArrowSize.toString(), 
                                        this.menuMargin.toString(), this.verticalSeparator.toString()];
            let all_color_themes = this._settings.get_value('color-themes').deep_unpack();
            for(let i = 0; i < all_color_themes.length; i++){
                this.isEqual = true;
                for(let l = 0; l < this.currentSettingsArray.length; l++){
                    if(this.currentSettingsArray[l] !==  all_color_themes[i][l + 1]){
                        this.isEqual=false;
                        break;
                    }
                }
                if(this.isEqual){
                    this.presetName = all_color_themes[i][0];
                    break;
                }      
            }
        }
});
 
var MenuLayoutsDialog = GObject.registerClass({
    Signals: {
        'menu-layout-response': { param_types: [GObject.TYPE_INT] },
    },
},  class Arc_Menu_MenuLayoutsDialog extends Gtk.Box {
        _init(settings, parent, tile, title) {
            super._init({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: false,
                valign: Gtk.Align.START
            });
            this.title = title;
            this._parent = parent;
            this._settings = settings;
            this.index = this._settings.get_enum('menu-layout');
            this.layoutStyle = tile.layout;
  
            this._params = {
                maxColumns: tile.layout.length > 3 ? 3 : tile.layout.length,
                thumbnailHeight: 155,
                thumbnailWidth: 155,
                styles: tile.layout
            };
            let mainFrame = new PW.FrameBox();
            let mainBox = new PW.FrameBoxRow({
                selectable: false,
                activatable: false,
            })
            mainBox._grid.orientation = Gtk.Orientation.VERTICAL;
            mainFrame.add(mainBox);
            let buttonBox = new Gtk.Box({
                spacing: 10
            });
            let applyButton = new Gtk.Button({
                label: _("Apply"),
                hexpand: true,
                halign: Gtk.Align.END
            });
            applyButton.connect('clicked', ()=> {
                let selectedBox = this._tileGrid.get_selected_children();
                this.index = selectedBox[0].get_child().layout;
                this._tileGrid.unselect_all();
                applyButton.set_sensitive(false);
                this.emit('menu-layout-response', -10);
            });
            let iconImage = new Gtk.Image({
                gicon: Gio.icon_new_for_string('go-previous-symbolic'),
            })
            let backButton = new PW.Button({
                icon_name: 'go-previous-symbolic',
                title: _("Back"),
                icon_first: true,
                halign: Gtk.Align.START
            });
            backButton.connect('clicked', ()=> {
                this.emit('menu-layout-response', -20);
            });
            buttonBox.append(backButton);
            let chooseNewLayoutLabel = new Gtk.Label({
                label: "<b>" + _(this.title) + " " + _("Menu Layouts") + "</b>",
                use_markup: true,
                halign: Gtk.Align.START,
                hexpand: true
            });
            buttonBox.append(chooseNewLayoutLabel);
            buttonBox.append(applyButton);
            applyButton.set_sensitive(false);

            this.append(buttonBox);
            this.append(mainFrame);
            this._tileGrid = new PW.TileGrid(this._params.maxColumns);

            this._params.styles.forEach((style) => {
                this._addTile(style.name, Me.path + style.thumbnail, style.layout);
            });

            mainBox.add(this._tileGrid);

            this._tileGrid.connect('selected-children-changed', () => {
                applyButton.set_sensitive(true);
            });

            this._tileGrid.set_selection_mode(Gtk.SelectionMode.NONE);
        }


        enableSelectionMode(){
            this._tileGrid.set_selection_mode(Gtk.SelectionMode.SINGLE);
        }

        _addTile(name, thumbnail, layout) {
            let tile = new PW.Tile(name, thumbnail, this._params.thumbnailWidth, this._params.thumbnailHeight, layout);
            this._tileGrid.insert(tile, -1);
        }
});

var MenuSettingsGeneralPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsGeneralPage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
        });

        this.set_child(this.mainBox);
        this._settings = settings;
        this.heightValue = this._settings.get_int('menu-height');
        this.rightPanelWidth = this._settings.get_int('right-panel-width');
        this.menuWidth = this._settings.get_int('menu-width');
        this.separatorColor = this._settings.get_string('separator-color');
        this.verticalSeparator = this._settings.get_boolean('vert-separator');
        this.largeIcons = this._settings.get_boolean('enable-large-icons');
        this.subMenus = this._settings.get_boolean('enable-sub-menus');
        this.disableRecentApps = this._settings.get_boolean('disable-recently-installed-apps');
        this.disableTooltips = this._settings.get_boolean('disable-tooltips');

        let generalSettingsFrame = new PW.FrameBox();
        //find the greatest screen height of all monitors
        //use that value to set Menu Height cap
        let display = Gdk.Display.get_default(); 
        let monitors = display.get_monitors();
        let nMonitors = monitors.get_n_items();
        let greatestHeight = 0;
        let scaleFactor = 1;   
        for (let i = 0; i < nMonitors; i++) {
            let monitor = monitors.get_item(i);
            let monitorHeight = monitor.get_geometry().height;
            if(monitorHeight > greatestHeight){
                scaleFactor = monitor.get_scale_factor();
                greatestHeight = monitorHeight;
            }   
        }        
        let monitorHeight = greatestHeight * scaleFactor;
        monitorHeight = Math.round((monitorHeight * 8) / 10);

        let heightRow = new PW.FrameBoxRow();
        let heightLabel = new Gtk.Label({
            label: _('Menu Height'),
            use_markup: true,
            xalign: 0,
            hexpand: false,
            selectable: false
        });
        let hscale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower: 300,
                upper: monitorHeight,
                step_increment: 10,
                page_increment: 10,
                page_size: 0
            }),
            tooltip_text: _("Adjust the menu height") + "\n" +_("Certain menu layouts only"),
            digits: 0,
            round_digits: 0,
            hexpand: true,
            value_pos: Gtk.PositionType.RIGHT
        });
        hscale.set_value(this.heightValue);
        hscale.connect('value-changed', () => {
            this.heightValue = hscale.get_value();
            if(hSpinButton.value !== this.heightValue)
                hSpinButton.set_value(this.heightValue);
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        let hSpinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 300, upper: monitorHeight, step_increment: 1, page_increment: 1, page_size: 0,
            }),
            climb_rate: 1,
            digits: 0,
            numeric: true,
        });
        hSpinButton.set_value(this.heightValue);
        hSpinButton.connect('value-changed', () => {
            this.heightValue = hSpinButton.get_value();
            if(hscale.value !== this.heightValue)
                hscale.set_value(this.heightValue);
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        heightRow.add(heightLabel);
        heightRow.add(hscale);
        heightRow.add(hSpinButton);
        generalSettingsFrame.add(heightRow);

        let menuWidthRow = new PW.FrameBoxRow();
        let menuWidthLabel = new Gtk.Label({
            label: _('Left-Panel Width'),
            xalign:0,
            hexpand: false,
        });   
        let menuWidthScale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower: 175, upper: 500, step_increment: 1, page_increment: 1, page_size: 0,
            }),
            tooltip_text: _("Adjust the left-panel width") + "\n" +_("Certain menu layouts only"),
            digits: 0,round_digits: 0,hexpand: true,
            value_pos: Gtk.PositionType.RIGHT
        });
        menuWidthScale.set_value(this.menuWidth);
        menuWidthScale.connect('value-changed', () => {
            this.menuWidth = menuWidthScale.get_value();
            if(menuWidthSpinButton.value !== this.menuWidth)
                menuWidthSpinButton.set_value(this.menuWidth);
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        let menuWidthSpinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 175, upper: 500, step_increment: 1, page_increment: 1, page_size: 0,
            }),
            climb_rate: 1,
            digits: 0,
            numeric: true,
        });
        menuWidthSpinButton.set_value(this.menuWidth);
        menuWidthSpinButton.connect('value-changed', () => {
            this.menuWidth = menuWidthSpinButton.get_value();
            if(menuWidthScale.value !== this.menuWidth)
                menuWidthScale.set_value(this.menuWidth);
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        menuWidthRow.add(menuWidthLabel);
        menuWidthRow.add(menuWidthScale);
        menuWidthRow.add( menuWidthSpinButton);
        generalSettingsFrame.add(menuWidthRow);

        let rightPanelWidthRow = new PW.FrameBoxRow();
        let rightPanelWidthLabel = new Gtk.Label({
            label: _('Right-Panel Width'),
            xalign:0,
            hexpand: false,
        });   
        let rightPanelWidthScale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower: 200,upper: 500, step_increment: 1, page_increment: 1, page_size: 0,
            }),
            tooltip_text: _("Adjust the right-panel width") + "\n" +_("Certain menu layouts only"),
            digits: 0,round_digits: 0,hexpand: true,
            value_pos: Gtk.PositionType.RIGHT
        });
        rightPanelWidthScale.set_value(this.rightPanelWidth);
        rightPanelWidthScale.connect('value-changed', () => {
            this.rightPanelWidth = rightPanelWidthScale.get_value();
            if(rightPanelWidthSpinButton.value !== this.rightPanelWidth)
                rightPanelWidthSpinButton.set_value(this.rightPanelWidth);
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        let rightPanelWidthSpinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 200,upper: 500, step_increment: 1, page_increment: 1, page_size: 0,
            }),
            climb_rate: 1,
            digits: 0,
            numeric: true,
        });
        rightPanelWidthSpinButton.set_value(this.rightPanelWidth);
        rightPanelWidthSpinButton.connect('value-changed', () => {
            this.rightPanelWidth = rightPanelWidthSpinButton.get_value();
            if(rightPanelWidthScale.value !== this.rightPanelWidth)
                rightPanelWidthScale.set_value(this.rightPanelWidth);
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        
        rightPanelWidthRow.add(rightPanelWidthLabel);
        rightPanelWidthRow.add(rightPanelWidthScale);
        rightPanelWidthRow.add(rightPanelWidthSpinButton);
        generalSettingsFrame.add(rightPanelWidthRow);
        this.mainBox.append(generalSettingsFrame);

        let miscSettingsFrame = new PW.FrameBox();
        let largeIconsRow = new PW.FrameBoxRow();
        let largeIconsLabel = new Gtk.Label({
            label: _('Large Application Icons'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
         });   
        let largeIconsSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Enable large application icons") + "\n" +_("Certain menu layouts only"),
        });
        largeIconsSwitch.set_active(this.largeIcons);
        largeIconsSwitch.connect('notify::active', (widget) => {
             this.largeIcons = widget.get_active();
             this.saveButton.set_sensitive(true);
             this.resetButton.set_sensitive(true);
        });
        largeIconsRow.add(largeIconsLabel);            
        largeIconsRow.add(largeIconsSwitch);             
        miscSettingsFrame.add(largeIconsRow);

        let subMenusRow = new PW.FrameBoxRow();
        let subMenusLabel = new Gtk.Label({
            label: _('Category Sub Menus'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
         });   
        let subMenusSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Show nested menus in categories") + "\n" +_("Certain menu layouts only"),
        });
        subMenusSwitch.set_active(this.subMenus);
        subMenusSwitch.connect('notify::active', (widget) => {
            this.subMenus = widget.get_active();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        subMenusRow.add(subMenusLabel);            
        subMenusRow.add(subMenusSwitch);  
        miscSettingsFrame.add(subMenusRow); 
        this.mainBox.append(miscSettingsFrame); 

        let tooltipFrame = new PW.FrameBox();
        let tooltipRow = new PW.FrameBoxRow();
        let tooltipLabel = new Gtk.Label({
            label: _("Disable Tooltips"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let tooltipSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Disable all tooltips in ArcMenu") 
        });
        tooltipSwitch.set_active(this.disableTooltips);
        tooltipSwitch.connect('notify::active', (widget) => {
            this.disableTooltips = widget.get_active();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        tooltipRow.add(tooltipLabel);
        tooltipRow.add(tooltipSwitch);
        tooltipFrame.add(tooltipRow);
        this.mainBox.append(tooltipFrame);

        let separatorFrame = new PW.FrameBox();
        let vertSeparatorRow = new PW.FrameBoxRow();
        let vertSeparatorLabel = new Gtk.Label({
            label: _('Enable Vertical Separator'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
         });   
        let vertSeparatorSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Enable a Vertical Separator") + "\n" +_("Certain menu layouts only"),
        });
        vertSeparatorSwitch.set_active(this.verticalSeparator);
        vertSeparatorSwitch.connect('notify::active', (widget) => { 
             this.verticalSeparator = widget.get_active();
             this.saveButton.set_sensitive(true);
             this.resetButton.set_sensitive(true);
        });
        vertSeparatorRow.add(vertSeparatorLabel);            
        vertSeparatorRow.add(vertSeparatorSwitch);             
        separatorFrame.add(vertSeparatorRow);
        
        let separatorColorRow = new PW.FrameBoxRow();
        let separatorColorLabel = new Gtk.Label({
            label: _('Separator Color'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
        });
        let colorChooser = new Gtk.ColorButton({
            use_alpha:true,
            tooltip_text: _("Change the color of all separators")
        });     
        let color = new Gdk.RGBA();
        color.parse(this.separatorColor);
        colorChooser.set_rgba(color);    
        colorChooser.connect('color-set', ()=>{
            this.separatorColor = colorChooser.get_rgba().to_string();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        separatorColorRow.add(separatorColorLabel);            
        separatorColorRow.add(colorChooser);             
        separatorFrame.add(separatorColorRow);
        this.mainBox.append(separatorFrame);

        let recentAppsFrame = new PW.FrameBox();
        let recentAppsRow = new PW.FrameBoxRow();
        let recentAppsLabel = new Gtk.Label({
            label: _("Disable Recently Installed Apps Indicator"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let recentAppsSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Disable Recently Installed Apps Indicator") 
        });
        recentAppsSwitch.set_active(this._settings.get_boolean('disable-recently-installed-apps'));
        recentAppsSwitch.connect('notify::active', (widget) => {
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
            this.disableRecentApps = widget.get_active();
            this._settings.set_boolean('disable-recently-installed-apps', widget.get_active());
        });
        recentAppsRow.add(recentAppsLabel);
        recentAppsRow.add(recentAppsSwitch);
        recentAppsFrame.add(recentAppsRow);

        let clearRecentAppsRow = new PW.FrameBoxRow();
        let clearRecentAppsLabel = new Gtk.Label({
            label: _('Clear all Applications Marked "New"'),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let clearRecentAppsButton = new Gtk.Button({ 
            halign: Gtk.Align.END,
            label: _("Clear All"),
            tooltip_text: _('Clear all applications marked "New"') 
        });
        let sensitive = this._settings.get_strv('recently-installed-apps').length > 0;
        clearRecentAppsButton.set_sensitive(sensitive);
        clearRecentAppsButton.connect('clicked', (widget) => {
            clearRecentAppsButton.set_sensitive(false);
            this._settings.reset('recently-installed-apps');
        });
        clearRecentAppsRow.add(clearRecentAppsLabel);
        clearRecentAppsRow.add(clearRecentAppsButton);
        recentAppsFrame.add(clearRecentAppsRow);

        this.mainBox.append(recentAppsFrame);

        let buttonRow = new Gtk.Box({
            valign: Gtk.Align.END,
            vexpand: true
        });
        this.resetButton = new Gtk.Button({
            label: _("Restore Defaults"),
            tooltip_text: _("Restore the default settings on this page")
        });
        this.resetButton.set_sensitive(this.checkIfResetButtonSensitive());
        this.resetButton.connect('clicked', ()=> {
            this.heightValue = this._settings.get_default_value('menu-height').unpack();
            this.rightPanelWidth = this._settings.get_default_value('right-panel-width').unpack();
            this.menuWidth = this._settings.get_default_value('menu-width').unpack();
            this.separatorColor = this._settings.get_default_value('separator-color').unpack();
            this.verticalSeparator = this._settings.get_default_value('vert-separator').unpack();
            this.largeIcons = this._settings.get_default_value('enable-large-icons').unpack();
            this.subMenus = this._settings.get_default_value('enable-sub-menus').unpack();
            this.disableRecentApps = this._settings.get_default_value('disable-recently-installed-apps').unpack();
            this.disableTooltips = this._settings.get_default_value('disable-tooltips').unpack();
            hscale.set_value(this.heightValue);
            menuWidthScale.set_value(this.menuWidth);
            rightPanelWidthScale.set_value(this.rightPanelWidth);
            subMenusSwitch.set_active(this.subMenus);
            vertSeparatorSwitch.set_active(this.verticalSeparator);
            largeIconsSwitch.set_active(this.largeIcons);
            tooltipSwitch.set_active(this.disableTooltips);
            color = new Gdk.RGBA();
            color.parse(this.separatorColor);
            colorChooser.set_rgba(color);   
            recentAppsSwitch.set_active(this.disableRecentApps);
   
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(false);
        });

        this.saveButton = new Gtk.Button({
            label: _("Apply"),
            hexpand: true
        });
        this.saveButton.connect('clicked', ()=> {
            this._settings.set_int('menu-height', this.heightValue);
            this._settings.set_int('right-panel-width', this.rightPanelWidth);
            this._settings.set_int('menu-width', this.menuWidth);
            this._settings.set_string('separator-color', this.separatorColor);
            this._settings.set_boolean('vert-separator', this.verticalSeparator);
            this._settings.set_boolean('enable-large-icons', this.largeIcons);
            this._settings.set_boolean('enable-sub-menus', this.subMenus);
            this._settings.set_boolean('disable-recently-installed-apps', this.disableRecentApps);
            this._settings.set_boolean('disable-tooltips', this.disableTooltips);
            this._settings.set_boolean('reload-theme', true);
            this.saveButton.set_sensitive(false);
            this.resetButton.set_sensitive(this.checkIfResetButtonSensitive());
        }); 
        this.saveButton.set_halign(Gtk.Align.END);
        this.saveButton.set_sensitive(false);

        buttonRow.append(this.resetButton);
        buttonRow.append(this.saveButton);
        this.mainBox.append(buttonRow);
    }

    checkIfResetButtonSensitive(){
        return (this.disableTooltips !== this._settings.get_default_value('disable-tooltips').unpack() ||
            this.disableRecentApps !== this._settings.get_default_value('disable-recently-installed-apps').unpack() ||
            this.heightValue !== this._settings.get_default_value('menu-height').unpack() ||
            this.rightPanelWidth !== this._settings.get_default_value('right-panel-width').unpack() ||
            this.menuWidth !== this._settings.get_default_value('menu-width').unpack() ||
            this.separatorColor !== this._settings.get_default_value('separator-color').unpack() ||
            this.verticalSeparator !== this._settings.get_default_value('vert-separator').unpack() ||
            this.largeIcons !== this._settings.get_default_value('enable-large-icons').unpack() ||
            this.subMenus !== this._settings.get_default_value('enable-sub-menus').unpack()) ? true : false
    }
});

var MenuSettingsFineTunePage = GObject.registerClass(
    class Arc_Menu_MenuSettingsFineTunePage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
        });

        this.set_child(this.mainBox);
        this._settings = settings;
        this.indicatorColor = this._settings.get_string('indicator-color');
        this.indicatorTextColor = this._settings.get_string('indicator-text-color');
        this.gapAdjustment = this._settings.get_int('gap-adjustment');
        this.disableCategoryArrow = this._settings.get_boolean('disable-category-arrows');
        this.removeMenuArrow = this._settings.get_boolean('remove-menu-arrow');
        this.disableSearchStyle = this._settings.get_boolean('disable-searchbox-border');
        this.alphabetizeAllPrograms = this._settings.get_boolean('alphabetize-all-programs')
        this.multiLinedLabels = this._settings.get_boolean('multi-lined-labels');

        let disableCategoryArrowFrame = new PW.FrameBox();
        let disableCategoryArrowRow = new PW.FrameBoxRow();
        let disableCategoryArrowLabel = new Gtk.Label({
            label: _('Disable Category Arrows'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
         });   
        let disableCategoryArrowSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Disable the arrow on category menu items") + "\n" +_("Certain menu layouts only"),
        });
        disableCategoryArrowSwitch.set_active(this.disableCategoryArrow);
        disableCategoryArrowSwitch.connect('notify::active', (widget) => {
             this.disableCategoryArrow = widget.get_active();
             this.saveButton.set_sensitive(true);
             this.resetButton.set_sensitive(true);
        });
        disableCategoryArrowRow.add(disableCategoryArrowLabel);            
        disableCategoryArrowRow.add(disableCategoryArrowSwitch);  
        disableCategoryArrowFrame.add(disableCategoryArrowRow);  
        this.mainBox.append(disableCategoryArrowFrame);  
        
        let searchStyleFrame = new PW.FrameBox();
        let searchStyleRow = new PW.FrameBoxRow();
        let searchStyleLabel = new Gtk.Label({
            label: _("Disable Searchbox Border"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let searchStyleSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Disable the border on the searchbox")
        });
        searchStyleSwitch.set_active(this._settings.get_boolean('disable-searchbox-border'));
        searchStyleSwitch.connect('notify::active', (widget) => {
            this.disableSearchStyle = widget.get_active();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        searchStyleRow.add(searchStyleLabel);
        searchStyleRow.add(searchStyleSwitch);
        searchStyleFrame.add(searchStyleRow);
        this.mainBox.append(searchStyleFrame);
        
        let tweakStyleFrame = new PW.FrameBox();
        let tweakStyleRow = new PW.FrameBoxRow();
        let tweakStyleLabel = new Gtk.Label({
            label: _("Disable Menu Arrow"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let tweakStyleSwitch = new Gtk.Switch({ 
            halign: Gtk.Align.END,
            tooltip_text: _("Disable current theme menu arrow pointer")
        });
        tweakStyleSwitch.set_active(this._settings.get_boolean('remove-menu-arrow'));
        tweakStyleSwitch.connect('notify::active', (widget) => {
            this.removeMenuArrow = widget.get_active();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        tweakStyleRow.add(tweakStyleLabel);
        tweakStyleRow.add(tweakStyleSwitch);
        tweakStyleFrame.add(tweakStyleRow);
        this.mainBox.append(tweakStyleFrame);
        
        let alphabetizeAllProgramsFrame = new PW.FrameBox();
        let alphabetizeAllProgramsRow = new PW.FrameBoxRow();
        let alphabetizeAllProgramsLabel = new Gtk.Label({
            label: _("Alphabetize 'All Programs' Category"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let alphabetizeAllProgramsSwitch = new Gtk.Switch({ halign: Gtk.Align.END });
        alphabetizeAllProgramsSwitch.set_active(this._settings.get_boolean('alphabetize-all-programs'));
        alphabetizeAllProgramsSwitch.connect('notify::active', (widget) => {
            this.alphabetizeAllPrograms = widget.get_active();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        alphabetizeAllProgramsRow.add(alphabetizeAllProgramsLabel);
        alphabetizeAllProgramsRow.add(alphabetizeAllProgramsSwitch);
        alphabetizeAllProgramsFrame.add(alphabetizeAllProgramsRow);
        this.mainBox.append(alphabetizeAllProgramsFrame);

        let multiLinedLabelFrame = new PW.FrameBox();
        let multiLinedLabelRow = new PW.FrameBoxRow();
        let multiLinedLabelLabel = new Gtk.Label({
            label: _("Multi-Lined Labels"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let multiLinedLabelSwitch = new Gtk.Switch({ halign: Gtk.Align.END, vexpand: false, valign: Gtk.Align.CENTER });
        multiLinedLabelSwitch.set_active(this._settings.get_boolean('multi-lined-labels'));
        multiLinedLabelSwitch.connect('notify::active', (widget) => {
            this.multiLinedLabels = widget.get_active();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        let multiLinedLabelInfoButton = new PW.Button({
                icon_name: 'info-circle-symbolic'
            });
        multiLinedLabelInfoButton.connect('clicked', ()=> {
            let dialog = new PW.MessageDialog({
                text: _("Multi-Lined Labels"),
                secondaryText: _('Enable/Disable multi-lined labels on large application icon layouts.'),
                buttons: Gtk.ButtonsType.OK,
                transient_for: this.get_root()
            });
            dialog.connect ('response', ()=> dialog.destroy());
            dialog.show();
        });
        multiLinedLabelRow.add(multiLinedLabelLabel);
        multiLinedLabelRow.add(multiLinedLabelSwitch);
        multiLinedLabelRow.add(multiLinedLabelInfoButton);
        multiLinedLabelFrame.add(multiLinedLabelRow);
        this.mainBox.append(multiLinedLabelFrame);

        let appIndicatorColorFrame = new PW.FrameBox();
        let recentlyInstalledInfoRow = new PW.FrameBoxRow();
        let recentlyInstalledInfoLabel = new Gtk.Label({
            label: _('Recently Installed Application Indicators'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false,
            sensitive: false
        });
        recentlyInstalledInfoRow.add(recentlyInstalledInfoLabel);
        appIndicatorColorFrame.add(recentlyInstalledInfoRow);
        let appIndicatorColorRow = new PW.FrameBoxRow();
        let appIndicatorColorLabel = new Gtk.Label({
            label: _('Category Indicator Color'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
        });
        let appIndicatorColorChooser = new Gtk.ColorButton({
            use_alpha: true,
            tooltip_text: _("Change the color of the 'recently installed application' category indicator")
        });     
        let color = new Gdk.RGBA();
        color.parse(this.indicatorColor);
        appIndicatorColorChooser.set_rgba(color);    
        appIndicatorColorChooser.connect('color-set', ()=>{
            this.indicatorColor = appIndicatorColorChooser.get_rgba().to_string();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        appIndicatorColorRow.add(appIndicatorColorLabel);            
        appIndicatorColorRow.add(appIndicatorColorChooser);             
        appIndicatorColorFrame.add(appIndicatorColorRow);

        let appIndicatorTextColorRow = new PW.FrameBoxRow();
        let appIndicatorTextColorLabel = new Gtk.Label({
            label: _('Application Indicator Label Color'),
            use_markup: true,
            xalign: 0,
            hexpand: true,
            selectable: false
        });
        let appIndicatorTextColorChooser = new Gtk.ColorButton({
            use_alpha: true,
            tooltip_text: _("Change the background color of the 'recently installed application' indicator label")
        });     
        color = new Gdk.RGBA();
        color.parse(this.indicatorTextColor);
        appIndicatorTextColorChooser.set_rgba(color);    
        appIndicatorTextColorChooser.connect('color-set', ()=>{
            this.indicatorTextColor = appIndicatorTextColorChooser.get_rgba().to_string();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });
        appIndicatorTextColorRow.add(appIndicatorTextColorLabel);            
        appIndicatorTextColorRow.add(appIndicatorTextColorChooser);             
        appIndicatorColorFrame.add(appIndicatorTextColorRow);
        this.mainBox.append(appIndicatorColorFrame);

        let gapAdjustmentFrame = new PW.FrameBox();
        let gapAdjustmentRow = new PW.FrameBoxRow();
        let gapAdjustmentLabel = new Gtk.Label({
            label: _('Gap Adjustment'),
            xalign:0,
            hexpand: false,
        });
        let gapAdjustmentScale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower: -1, upper: 1, step_increment: 1, page_increment: 1, page_size: 0
            }),
            digits: 0,round_digits: 0,hexpand: true,
            value_pos: Gtk.PositionType.RIGHT,
            draw_value: true,
            tooltip_text: _("Offset ArcMenu by 1px") +'\n' + _("Useful if you notice a 1px gap or overlap between ArcMenu and the panel")
        });
        gapAdjustmentScale.set_format_value_func( (scale, value) => {
            return "\t" + value + "px";
        });
        gapAdjustmentScale.set_value(this.gapAdjustment);
        gapAdjustmentScale.connect('value-changed', () => {
            this.gapAdjustment = gapAdjustmentScale.get_value();
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(true);
        });

        let gapAdjustmentInfoButton = new PW.Button({
                icon_name: 'info-circle-symbolic'
            });
        gapAdjustmentInfoButton.connect('clicked', ()=> {
            let dialog = new PW.MessageDialog({
                text: _("Offset ArcMenu by 1px"),
                secondaryText: _('Useful if you notice a 1px gap or overlap between ArcMenu and the panel'),
                buttons: Gtk.ButtonsType.OK,
                transient_for: this.get_root()
            });
            dialog.connect ('response', ()=> dialog.destroy());
            dialog.show();
        });
        gapAdjustmentRow.add(gapAdjustmentLabel);
        gapAdjustmentRow.add(gapAdjustmentScale);
        gapAdjustmentRow.add(gapAdjustmentInfoButton);
        gapAdjustmentFrame.add(gapAdjustmentRow);
        this.mainBox.append(gapAdjustmentFrame);

        let buttonRow = new Gtk.Box({
            valign: Gtk.Align.END,
            vexpand: true
        });
        this.resetButton = new Gtk.Button({
            label: _("Restore Defaults"),
            tooltip_text: _("Restore the default settings on this page")
        });
        this.resetButton.set_sensitive(this.checkIfResetButtonSensitive());
        this.resetButton.connect('clicked', ()=> {
            this.indicatorColor = this._settings.get_default_value('indicator-color').unpack();
            this.indicatorTextColor = this._settings.get_default_value('indicator-text-color').unpack();
            this.gapAdjustment = this._settings.get_default_value('gap-adjustment').unpack();
            this.disableCategoryArrow = this._settings.get_default_value('disable-category-arrows').unpack();
            this.removeMenuArrow = this._settings.get_default_value('remove-menu-arrow').unpack();
            this.disableSearchStyle = this._settings.get_default_value('disable-searchbox-border').unpack();
            this.alphabetizeAllPrograms = this._settings.get_default_value('alphabetize-all-programs').unpack();
            this.multiLinedLabels = this._settings.get_default_value('multi-lined-labels').unpack();
            alphabetizeAllProgramsSwitch.set_active(this.alphabetizeAllPrograms);
            gapAdjustmentScale.set_value(this.gapAdjustment);
            disableCategoryArrowSwitch.set_active(this.disableCategoryArrow);
            searchStyleSwitch.set_active(this.disableSearchStyle); 
            tweakStyleSwitch.set_active(this.removeMenuArrow);
            multiLinedLabelSwitch.set_active(this.multiLinedLabels);
            let color = new Gdk.RGBA();
            color.parse(this.indicatorColor);
            appIndicatorColorChooser.set_rgba(color);
            color.parse(this.indicatorTextColor);
            appIndicatorTextColorChooser.set_rgba(color);         
   
            this.saveButton.set_sensitive(true);
            this.resetButton.set_sensitive(false);
        });

        this.saveButton = new Gtk.Button({
            label: _("Apply"),
            hexpand: true
        });
        this.saveButton.connect('clicked', ()=> {
            this._settings.set_string('indicator-color', this.indicatorColor);
            this._settings.set_string('indicator-text-color', this.indicatorTextColor);
            this._settings.set_int('gap-adjustment', this.gapAdjustment);
            this._settings.set_boolean('disable-category-arrows', this.disableCategoryArrow);
            this._settings.set_boolean('remove-menu-arrow', this.removeMenuArrow);
            this._settings.set_boolean('disable-searchbox-border', this.disableSearchStyle);
            this._settings.set_boolean('alphabetize-all-programs', this.alphabetizeAllPrograms);
            this._settings.set_boolean('multi-lined-labels', this.multiLinedLabels);
            this._settings.set_boolean('reload-theme', true);
            this.saveButton.set_sensitive(false);
            this.resetButton.set_sensitive(this.checkIfResetButtonSensitive());
        }); 
        this.saveButton.set_halign(Gtk.Align.END);
        this.saveButton.set_sensitive(false);

        buttonRow.append(this.resetButton);
        buttonRow.append(this.saveButton);
        this.mainBox.append(buttonRow);
    }

    checkIfResetButtonSensitive(){
        return (
            this.indicatorColor !== this._settings.get_default_value('indicator-color').unpack() ||
            this.indicatorTextColor !== this._settings.get_default_value('indicator-text-color').unpack() ||
            this.gapAdjustment !== this._settings.get_default_value('gap-adjustment').unpack() ||
            this.disableCategoryArrow !== this._settings.get_default_value('disable-category-arrows').unpack() ||
            this.removeMenuArrow !== this._settings.get_default_value('remove-menu-arrow').unpack() ||
            this.disableSearchStyle !== this._settings.get_default_value('disable-searchbox-border').unpack()||
            this.alphabetizeAllPrograms !== this._settings.get_default_value('alphabetize-all-programs').unpack()||
            this.multiLinedLabels !== this._settings.get_default_value('multi-lined-labels').unpack()) ? true : false;
    }
});

var MenuSettingsCategoriesPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsCategoriesPage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
        });

        this.set_child(this.mainBox);
        this._settings = settings;
        this.categoriesFrame = new PW.FrameBox();

        this.resetButton = new Gtk.Button({
            label: _("Restore Defaults"),
            tooltip_text: _("Restore the default settings on this page")
        });
        this.saveButton = new Gtk.Button({
            label: _("Apply"),
            hexpand: true
        });

        this._createFrame(this._settings.get_value("extra-categories").deep_unpack());
        this.mainBox.append(this.categoriesFrame);

        let buttonRow = new Gtk.Box({
            valign: Gtk.Align.END,
            vexpand: true
        });

        this.resetButton.set_sensitive(this.getSensitive());

        this.resetButton.connect('clicked', ()=> {
            this.saveButton.set_sensitive(true);
            this.categoriesFrame.remove_all_children();
            this._createFrame(this._settings.get_default_value('extra-categories').deep_unpack());
            this.categoriesFrame.show();
            this.resetButton.set_sensitive(false);
        });

        this.saveButton.connect('clicked', ()=> {
            let array = [];
            for(let i = 0; i < this.categoriesFrame.count; i++) {
                let frame = this.categoriesFrame.get_index(i);
                array.push([frame._enum, frame._shouldShow]);
            }
            this._settings.set_value('extra-categories', new GLib.Variant('a(ib)', array));
            this.saveButton.set_sensitive(false);
            this.resetButton.set_sensitive(this.getSensitive());
        }); 
        this.saveButton.set_halign(Gtk.Align.END);
        this.saveButton.set_sensitive(false);
        buttonRow.append(this.resetButton);
        buttonRow.append(this.saveButton);
        this.mainBox.append(buttonRow);
    }

    getSensitive(){
        let defaultExtraCategories = this._settings.get_default_value("extra-categories").deep_unpack();
        let currentExtraCategories = this._settings.get_value("extra-categories").deep_unpack();
        return !Utils.getArraysEqual(defaultExtraCategories, currentExtraCategories);
    }

    _createFrame(extraCategories){
        for(let i = 0; i < extraCategories.length; i++){
            let categoryEnum = extraCategories[i][0];
            let name = Constants.CATEGORIES[categoryEnum].Name;

            let frameRow = new PW.FrameBoxDragRow(this);
            frameRow._enum = extraCategories[i][0];
            frameRow._shouldShow = extraCategories[i][1]; 
            frameRow._name = Constants.CATEGORIES[categoryEnum].Name; 
            frameRow._gicon = Gio.icon_new_for_string(Constants.CATEGORIES[categoryEnum].Icon);
            frameRow.saveButton = this.saveButton;
            frameRow.resetButton = this.resetButton;
            frameRow.hasSwitch = true;
            frameRow.switchActive = frameRow._shouldShow;
            
            let applicationIcon = new Gtk.Image( {
                gicon: frameRow._gicon,
                pixel_size: 22
            });
            let applicationImageBox = new Gtk.Box( {
                margin_start: 0,
                hexpand: false,
                vexpand: false,
                spacing: 5,
            });
            let dragImage = new Gtk.Image( {
                gicon: Gio.icon_new_for_string("list-drag-handle-symbolic"),
                pixel_size: 12
            });
            applicationImageBox.append(dragImage);
            applicationImageBox.append(applicationIcon);
            frameRow.add(applicationImageBox);

            let softwareShortcutsLabel = new Gtk.Label({
                label: _(name),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let buttonBox = new PW.EditEntriesBox({
                frameRow: frameRow, 
                frame: this.categoriesFrame, 
                buttons: [this.saveButton, this.resetButton],
            });
         
            let modifyButton = new Gtk.Switch({
                valign: Gtk.Align.CENTER,
                margin_start: 10,
                tooltip_text: _('Enable/Disble')
            });
            
            modifyButton.set_active(frameRow._shouldShow);
            modifyButton.connect('notify::active', ()=> {
                frameRow._shouldShow = modifyButton.get_active(); 
                this.saveButton.set_sensitive(true);
                this.resetButton.set_sensitive(true);
            });
            buttonBox.insert_column(0);
            buttonBox.attach(Gtk.Separator.new(Gtk.Orientation.VERTICAL), 0, 0, 1, 1);
            buttonBox.insert_column(0);
            buttonBox.attach(modifyButton, 0, 0, 1, 1);
            
            frameRow.add(softwareShortcutsLabel);
            frameRow.add(buttonBox);
            this.categoriesFrame.add(frameRow);
        }
    }
});
  
var ColorThemeDialogWindow = GObject.registerClass(
    class Arc_Menu_ColorThemeDialogWindow extends PW.DialogWindow {
        _init(settings, parent, themeName="") {
            this._settings = settings;
            this.addResponse = false;
            this.themeName = themeName;
            super._init(_('Color Theme Name'), parent);
        }

        _createLayout(vbox) {        
            let nameFrameRow = new PW.FrameBoxRow();
            let nameFrameLabel = new Gtk.Label({
                label: _('Name:'),
                use_markup: true,
                xalign: 0,
                hexpand: true,
                selectable: false
            });
            nameFrameRow.add(nameFrameLabel);
            this.nameEntry = new Gtk.Entry();
            this.nameEntry.set_width_chars(35);
            
            nameFrameRow.add(this.nameEntry);
            this.nameEntry.grab_focus();
            if(this.themeName!=""){
                this.nameEntry.set_text(this.themeName);
            }
            this.nameEntry.connect('changed',()=>{
                if(this.nameEntry.get_text().length > 0)
                    saveButton.set_sensitive(true);
                else
                    saveButton.set_sensitive(false);
            });
        
            vbox.append(nameFrameRow);
            let saveButton = new Gtk.Button({
                label: _("Save Theme"),
                halign: Gtk.Align.END
            });   
            saveButton.set_sensitive(false);
            saveButton.connect('clicked', ()=> {
                this.themeName = this.nameEntry.get_text();
                this.addResponse=true;
                this.response(-10);
            });
            vbox.append(saveButton);
        }
        get_response(){
            return this.addResponse;
        }
});

var ExportColorThemeDialogWindow = GObject.registerClass(
    class Arc_Menu_ExportColorThemeDialogWindow extends PW.DialogWindow {

        _init(settings, parent, themes=null) {
            this._settings = settings;
            this._themes = themes;
            this.addResponse = false;
            this.selectedThemes = [];
            super._init(this._themes ? _('Select Themes to Import'): _('Select Themes to Export'), parent);
        }

        _createLayout(vbox) {  
            vbox.spacing = 0;
            this.checkButtonArray = [];
            this.shouldToggle =true;
            let themesListScrollWindow = new Gtk.ScrolledWindow();
            themesListScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
            themesListScrollWindow.set_max_content_height(300);
            themesListScrollWindow.set_min_content_height(300);
            themesListScrollWindow.set_min_content_width(500);
            themesListScrollWindow.set_min_content_width(500);
            this.mainFrame = new PW.FrameBox();

            let themesListButton = new Gtk.Button({
                label: this._themes ?_("Import"): _("Export"),
            });

            themesListButton.connect('clicked', () => {
                this.addResponse = true;
                this.response(-10);
            });
	        themesListButton.set_halign(Gtk.Align.END);
           
            themesListScrollWindow.set_child(this.mainFrame);
            this.checkAllButton = new Gtk.CheckButton({
                margin_end: 23
            });

            this.checkAllButton.set_halign(Gtk.Align.END);
            this.checkAllButton.set_active(true);
            this.checkAllButton.connect('toggled', () => {   
                let isActive = this.checkAllButton.get_active();
                if(this.shouldToggle){
                    for(let i = 0; i< this.checkButtonArray.length; i++){
                        this.checkButtonArray[i].set_active(isActive);
                    }
                }
            });
            let checkAllRow = new PW.FrameBoxRow();
            let checkAllLabel = new Gtk.Label({
                use_markup: false,
                xalign: 0,
                hexpand: true,
                label: _("Select All"),
                halign: Gtk.Align.END
            });
            checkAllRow.add(checkAllLabel);
            checkAllRow.add(this.checkAllButton);
            vbox.append(checkAllRow);
            vbox.append(themesListScrollWindow);
            vbox.append(new PW.FrameBoxRow());
            vbox.append(themesListButton);

            this.color_themes = this._themes ? this._themes : this._settings.get_value('color-themes').deep_unpack();
            for(let i = 0; i< this.color_themes.length; i++) {
                let theme = this.color_themes[i];
                let frameRow = new PW.FrameBoxRow();

                let themeBox = new Gtk.Box();

                let frameLabel = new Gtk.Label({
                    use_markup: false,
                    xalign: 0,
                    label: theme[0],
                    hexpand: true
                });
   
                let xpm = Utils.createXpmImage(theme[1], theme[2], theme[4], theme[5]);
                let presetPreview = new Gtk.Image({
                    hexpand: false,
                    margin_end: 5,
                    pixel_size: 42
                });
                presetPreview.set_from_pixbuf(GdkPixbuf.Pixbuf.new_from_xpm_data(xpm));
                themeBox.append(presetPreview);
                themeBox.append(frameLabel);
                frameRow.add(themeBox);
    
                let checkButton = new Gtk.CheckButton({
                    margin_end: 20
                });
                checkButton.connect('toggled', () => {
                    if(checkButton.get_active()){
                        this.selectedThemes.push(theme);
                    }
                    else{
                        this.shouldToggle = false;
                        this.checkAllButton.set_active(false);
                        this.shouldToggle = true;
                        let index= this.selectedThemes.indexOf(theme);
                        this.selectedThemes.splice(index,1);
                    }
                });
                this.checkButtonArray.push(checkButton);
                frameRow.add(checkButton);
                this.mainFrame.add(frameRow);
                checkButton.set_active(true);
            }    
        }
        get_response(){
            return this.addResponse;
        }
});

var ManageColorThemeDialogWindow = GObject.registerClass(
    class Arc_Menu_ManageColorThemeDialogWindow extends PW.DialogWindow {
        _init(settings, parent) {
            this._settings = settings;
            this.addResponse = false;
            this.selectedThemes = [];
            super._init( _('Manage Presets'), parent);
        }

        _createLayout(vbox) {    
            let themesListScrollWindow = new Gtk.ScrolledWindow();
            themesListScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
            themesListScrollWindow.set_max_content_height(300);
            themesListScrollWindow.set_min_content_height(300);
            themesListScrollWindow.set_min_content_width(500);
            themesListScrollWindow.set_min_content_width(500);
            this.mainFrame = new PW.FrameBox();
            let buttonRow = new PW.FrameBoxRow();

            let applyButton = new Gtk.Button({
                label: _("Apply"),
                hexpand: true
            });
            applyButton.set_sensitive(false);
            applyButton.connect('clicked', () => {
                this.addResponse = true;
                this.response(-10);
            });
	        applyButton.set_halign(Gtk.Align.END);

            themesListScrollWindow.set_child(this.mainFrame);
            vbox.append(themesListScrollWindow);
            buttonRow.add(applyButton);
            vbox.append(buttonRow);

            this.color_themes = this._settings.get_value('color-themes').deep_unpack();
            for(let i = 0; i< this.color_themes.length; i++) {
                let theme = this.color_themes[i];
                let frameRow = new PW.FrameBoxRow();
                let themeBox = new Gtk.Box();

                let frameLabel = new Gtk.Label({
                    use_markup: false,
                    xalign: 0,
                    label: theme[0],
                    hexpand: true
                });
                let xpm = Utils.createXpmImage(theme[1], theme[2], theme[4], theme[5]);
                let presetPreview = new Gtk.Image({
                    hexpand: false,
                    margin_end: 5,
                    pixel_size: 42
                });
                presetPreview.set_from_pixbuf(GdkPixbuf.Pixbuf.new_from_xpm_data(xpm));
                
                themeBox.append(presetPreview);
                themeBox.append(frameLabel);
                frameRow.add(themeBox);
    
                let buttonBox = new PW.EditEntriesBox({
                    frameRow: frameRow, 
                    frame: this.mainFrame, 
                    buttons: [applyButton],
                    modifyButton: true,
                    deleteButton: true
                });
                
                buttonBox.connect('modify', () => {
                    let dialog = new ColorThemeDialogWindow(this._settings, this, theme[0]);
                    dialog.show();
                    dialog.connect('response', (response) => { 
                        if(dialog.get_response()) {
                            let index = frameRow.get_index();
                            let array = [dialog.themeName, theme[1], theme[2], theme[3], theme[4], theme[5], 
                                        theme[6], theme[7], theme[8], theme[9], theme[10], theme[11], theme[12]];
                            this.color_themes.splice(index,1,array);
                            theme = array;
                            frameLabel.label = dialog.themeName;
                            dialog.destroy();
                        }
                        else
                            dialog.destroy();
                    }); 
                    applyButton.set_sensitive(true);
                });
                buttonBox.connect('move-up', () => {
                    let index = frameRow.get_index();
                    if(index > 0){
                        this.color_themes.splice(index, 1);
                        this.color_themes.splice(index - 1, 0, theme);
                    }
                });

                buttonBox.connect('move-down', () => {
                    let index = frameRow.get_index();
                    if(index + 1 < this.mainFrame.count){
                        this.color_themes.splice(index, 1);
                        this.color_themes.splice(index + 1, 0, theme);
                    }
                });

                buttonBox.connect('delete', () => {
                    let index = frameRow.get_index();
                    this.color_themes.splice(index, 1);
                });
                
                frameRow.add(buttonBox);
                this.mainFrame.add(frameRow);
            }    
        }
        get_response(){
            return this.addResponse;
        }
});
  
var OverrideArcMenuThemeWindow = GObject.registerClass({
    Signals: {
        'menu-theme-response': { param_types: [GObject.TYPE_INT] },
    },
},
    class Arc_Menu_OverrideArcMenuThemeWindow extends Gtk.Box {
        _init(settings, parentBox) {
            super._init({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
            });
            this.parentBox = parentBox;
            this._settings = settings;
            this.addResponse = false;
            this.heightValue = this._settings.get_int('menu-height');
            this.rightPanelWidth = this._settings.get_int('right-panel-width');
            this.separatorColor = this._settings.get_string('separator-color');
            this.verticalSeparator = this._settings.get_boolean('vert-separator');
            this.customArcMenu = this._settings.get_boolean('enable-custom-arc-menu');
            
            this.menuColor = this._settings.get_string('menu-color');
            this.menuForegroundColor = this._settings.get_string('menu-foreground-color');
            this.borderColor = this._settings.get_string('border-color');
            this.highlightColor = this._settings.get_string('highlight-color');
            this.highlightForegroundColor = this._settings.get_string('highlight-foreground-color');
            this.fontSize = this._settings.get_int('menu-font-size');
            this.borderSize = this._settings.get_int('menu-border-size');
            this.cornerRadius = this._settings.get_int('menu-corner-radius');
            this.menuMargin = this._settings.get_int('menu-margin');
            this.menuArrowSize = this._settings.get_int('menu-arrow-size');
            this.menuWidth = this._settings.get_int('menu-width');
            this.updatePresetComboBox = true;
            this.shouldDeselect = true; 
            this._createLayout(this);
        }
        createIconList(store){
            this.color_themes = this._settings.get_value('color-themes').deep_unpack();
            for(let i= 0; i<this.color_themes.length; i++){
                let text = this.color_themes[i][0];
                let color1 = this.color_themes[i][1];
                let color2 = this.color_themes[i][2];
                let color3 = this.color_themes[i][4];
                let color4 = this.color_themes[i][5];
                let xpm = Utils.createXpmImage(color1, color2, color3, color4);
                let pixbuf = GdkPixbuf.Pixbuf.new_from_xpm_data(xpm);

                store.set(store.append(), [0, 1], [pixbuf, _(text)]);
            }
        }
        _createLayout(vbox) {         
            let customArcMenuOptionsFrame = new PW.FrameBox();

            let colorPresetHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Menu Theme Presets') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            vbox.append(colorPresetHeaderLabel);

            this.colorPresetFrame = new PW.FrameBox();
            let colorPresetRow = new PW.FrameBoxRow();
            let colorPresetLabel = new Gtk.Label({
                label: _('Current Menu Theme Preset'),
                xalign:0,
                hexpand: true,
            });   
            let store = new Gtk.ListStore();
            store.set_column_types([GdkPixbuf.Pixbuf, GObject.TYPE_STRING]);
            this.colorPresetCombo = new Gtk.ComboBox({
                model: store,
            });
            
            this.createIconList(store);

            let renderer = new Gtk.CellRendererPixbuf({xpad: 5});
            this.colorPresetCombo.pack_start(renderer, false);
            this.colorPresetCombo.add_attribute(renderer, "pixbuf", 0);
            renderer = new Gtk.CellRendererText();
            this.colorPresetCombo.pack_start(renderer, true);
            this.colorPresetCombo.add_attribute(renderer, "text", 1);
            
            this.saveButton = new Gtk.Button({
                label: _("Save as Preset"),
                hexpand: true,
                halign: Gtk.Align.END
            });   
            this.checkIfPresetMatch();
            this.colorPresetCombo.connect('changed', (widget) => { 
                if(this.updatePresetComboBox){
                    let index = widget.get_active();
                    /*let defaultArray = ["Theme Name","Background Color", "Foreground Color","Border Color", "Highlight Color", "Hightlight Foreground Color", "Separator Color"
                                            , "Font Size", "Border Size", "Corner Radius", "Arrow Size", "Menu Displacement", "Vertical Separator"];*/
                    if(index>=0){
                        this.menuColor = this.color_themes[index][1];
                        this.menuForegroundColor = this.color_themes[index][2];
                        this.borderColor = this.color_themes[index][3];
                        this.highlightColor = this.color_themes[index][4];
                        this.highlightForegroundColor = this.color_themes[index][5];
                        this.separatorColor = this.color_themes[index][6];
                        this.fontSize = parseInt(this.color_themes[index][7]);
                        this.borderSize = parseInt(this.color_themes[index][8]);
                        this.cornerRadius = parseInt(this.color_themes[index][9]);
                        this.menuArrowSize = parseInt(this.color_themes[index][10]);
                        this.menuMargin = parseInt(this.color_themes[index][11]);
                        this.verticalSeparator = (this.color_themes[index][12] === 'true');
                        
                        this.shouldDeselect = false;
                        this.presetName=this.color_themes[index][0];
                        color.parse(this.menuColor);
                        menuBackgroudColorChooser.set_rgba(color);
        
                        color.parse(this.menuForegroundColor);
                        menuForegroundColorChooser.set_rgba(color); 
        
                        fontScale.set_value(this.fontSize); 
        
                        color.parse(this.borderColor);
                        borderColorChooser.set_rgba(color); 
        
                        borderScale.set_value(this.borderSize);
        
                        color.parse(this.highlightColor);
                        itemColorChooser.set_rgba(color);

                        color.parse(this.highlightForegroundColor);
                        itemForegroundColorChooser.set_rgba(color);
        
                        cornerScale.set_value(this.cornerRadius);
                        marginScale.set_value(this.menuMargin);
                        arrowScale.set_value(this.menuArrowSize);

                        vertSeparatorSwitch.set_active(this.verticalSeparator);
                        color.parse(this.separatorColor);
                        colorChooser.set_rgba(color);  
                        this.saveButton.set_sensitive(false);
                        applyButton.set_sensitive(true);  
                        this.shouldDeselect = true;    
                        resetButton.set_sensitive(this.checkIfResetButtonSensitive()); 
                    }         
                }    
            });
            colorPresetRow.add(colorPresetLabel);
            colorPresetRow.add(this.colorPresetCombo);
            this.colorPresetFrame.add(colorPresetRow);

            let presetsButtonRow = new PW.FrameBoxRow();
            
            this.saveButton.connect('clicked', () => {
                /*let defaultArray = ["Theme Name","Background Color", "Foreground Color","Border Color", "Highlight Color", "Separator Color"
                                , "Font Size", "Border Size", "Corner Radius", "Arrow Size", "Menu Displacement", "Vertical Separator"];*/
                let dialog = new ColorThemeDialogWindow(this._settings, this);
                dialog.show();
                dialog.connect('response', (response) => { 
                    if(dialog.get_response()){
                        let array = [dialog.themeName, this.menuColor, this.menuForegroundColor, this.borderColor, this.highlightColor, this.highlightForegroundColor, this.separatorColor, 
                                        this.fontSize.toString(), this.borderSize.toString(), this.cornerRadius.toString(), this.menuArrowSize.toString(), 
                                        this.menuMargin.toString(), this.verticalSeparator.toString()];
                        this.color_themes.push(array);
                        this._settings.set_value('color-themes',new GLib.Variant('aas',this.color_themes));
                        store.clear();
                        this.createIconList(store);
                        this.colorPresetCombo.model = store;
                        this.colorPresetCombo.show();
                        this.checkIfPresetMatch();
                        dialog.destroy();
                    }
                    else
                        dialog.destroy();
                }); 
            });

                        
            let manageButton = new Gtk.Button({
                label: _("Manage Presets")
            });   
            manageButton.connect('clicked', ()=> {            
                let dialog = new ManageColorThemeDialogWindow(this._settings, this);
                dialog.show();
                dialog.connect('response', (response)=>{ 
                    if(dialog.get_response()){
                        this.color_themes = dialog.color_themes;
                        this._settings.set_value('color-themes',new GLib.Variant('aas',dialog.color_themes));
                        store.clear();
                        this.createIconList(store);
                        this.colorPresetCombo.model = store;
                        this.colorPresetCombo.show();

                        this.checkIfPresetMatch();
                        dialog.destroy();
                    }
                    else
                        dialog.destroy();
                }); 
            });
            let addButton = new PW.Button({
                title: _("Browse Presets"),
                icon_name: "browse-presets-symbolic",
                hexpand: false
            });
            addButton.connect('clicked', () => {
                let settingsFile = Gio.File.new_for_path(Me.path + '/media/misc/ArcMenuDefaultPresets');
                let [ success, content, etags] = settingsFile.load_contents(null);
                let string = content.toString();
                let themes = string.split("\n")
                themes.pop(); //remove last blank array 
                let colorThemes = [];
                for(let i = 0; i < themes.length; i++){
                    let array = themes[i].split('//')
                    array.pop();
                    colorThemes.push(array);
                }
                let dialog = new ExportColorThemeDialogWindow(this._settings, this, colorThemes);
                dialog.show();
                dialog.connect('response', (response) => { 
                    if(dialog.get_response()){
                        let selectedThemes = dialog.selectedThemes;
                        this.color_themes = this._settings.get_value('color-themes').deep_unpack();
                        for(let i = 0; i < selectedThemes.length; i++){
                            this.color_themes.push(selectedThemes[i]);
                        }
                        this._settings.set_value('color-themes',new GLib.Variant('aas',this.color_themes));
                        store.clear();
                        this.createIconList(store);
                        this.colorPresetCombo.model = store;
                        this.colorPresetCombo.show();
                        this.checkIfPresetMatch();
                        dialog.destroy();
                    }
                    else
                        dialog.destroy();
                });  
            });

            presetsButtonRow.add(manageButton);
            presetsButtonRow.add(addButton);
            presetsButtonRow.add(this.saveButton);
            this.colorPresetFrame.add(presetsButtonRow);
            vbox.append(this.colorPresetFrame);

            let menuSettingsHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Theme Settings') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            vbox.append(menuSettingsHeaderLabel);

            let themeSettingsFrame = new Gtk.ListBox();
            let themeSettingsFrameScrollWindow = new Gtk.ScrolledWindow();
            themeSettingsFrameScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
            themeSettingsFrameScrollWindow.set_max_content_height(235);
            themeSettingsFrameScrollWindow.set_min_content_height(235);
            themeSettingsFrameScrollWindow.set_child(themeSettingsFrame);
            customArcMenuOptionsFrame.add(themeSettingsFrameScrollWindow);

            //ROW 1 - MENU BACKGROUND COLOR--------------------------------------   
            let menuBackgroudColorRow = new PW.FrameBoxRow();
            let menuBackgroudColorLabel = new Gtk.Label({
                label: _('Menu Background Color'),
                xalign:0,
                hexpand: true,
            });   
            let menuBackgroudColorChooser = new Gtk.ColorButton({use_alpha:true});   
            let color = new Gdk.RGBA();
            color.parse(this.menuColor);
            menuBackgroudColorChooser.set_rgba(color);            
            menuBackgroudColorChooser.connect('color-set', () => {
                this.menuColor = menuBackgroudColorChooser.get_rgba().to_string();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            menuBackgroudColorRow.add(menuBackgroudColorLabel);
            menuBackgroudColorRow.add(menuBackgroudColorChooser);
            themeSettingsFrame.append(menuBackgroudColorRow);

            //ROW 2 - MENU FOREGROUND COLOR--------------------------------------   
            let menuForegroundColorRow = new PW.FrameBoxRow();
            let menuForegroundColorLabel = new Gtk.Label({
                label: _('Menu Foreground Color'),
                xalign:0,
                hexpand: true,
             });   
            let menuForegroundColorChooser = new Gtk.ColorButton({use_alpha:true});     
            color.parse(this.menuForegroundColor);
            menuForegroundColorChooser.set_rgba(color);            
            menuForegroundColorChooser.connect('color-set', () => {
                this.menuForegroundColor = menuForegroundColorChooser.get_rgba().to_string();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            menuForegroundColorRow.add(menuForegroundColorLabel);
            menuForegroundColorRow.add(menuForegroundColorChooser);
            themeSettingsFrame.append(menuForegroundColorRow);

            //ROW 3 - FONT SIZE--------------------------------------------------   
            let fontSizeRow = new PW.FrameBoxRow();
            let fontSizeLabel = new Gtk.Label({
                label: _('Font Size'),
                xalign:0,
                hexpand: true,
            });   

            let fontScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({lower: 8, upper: 14, step_increment: 1, page_increment: 1, page_size: 0 }),
                digits: 0, round_digits: 0, hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            fontScale.set_format_value_func( (scale, value) => {
                return value + "pt";
            });
            fontScale.set_value(this.fontSize);
            fontScale.connect('value-changed', () => {
                this.fontSize = fontScale.get_value();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            fontSizeRow.add(fontSizeLabel);
            fontSizeRow.add(fontScale);
            themeSettingsFrame.append(fontSizeRow);

            //ROW 4- Border Color-------------------------------------------------
            let borderColorRow = new PW.FrameBoxRow();
            let borderColorLabel = new Gtk.Label({
                label: _('Border Color'),
                xalign:0,
                hexpand: true,
            });   
            let borderColorChooser = new Gtk.ColorButton({use_alpha:true});     
            color = new Gdk.RGBA();
            color.parse(this.borderColor);
            borderColorChooser.set_rgba(color);            
            borderColorChooser.connect('color-set', ()=>{
                this.borderColor = borderColorChooser.get_rgba().to_string();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            borderColorRow.add(borderColorLabel);
            borderColorRow.add(borderColorChooser);
            themeSettingsFrame.append(borderColorRow);

            //ROW 5 - Border Size-------------------------------------------------------
            let borderSizeRow = new PW.FrameBoxRow();
            let borderSizeLabel = new Gtk.Label({
                label: _('Border Size'),
                xalign:0,
                hexpand: true,
            });   
            let borderScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({lower: 0, upper: 4, step_increment: 1, page_increment: 1, page_size: 0}),
                digits: 0, round_digits: 0, hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            borderScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
            borderScale.set_value(this.borderSize);
            borderScale.connect('value-changed', () => {
                this.borderSize = borderScale.get_value();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            }); 
            borderSizeRow.add(borderSizeLabel);
            borderSizeRow.add(borderScale);
            themeSettingsFrame.append(borderSizeRow);

            //ROW 6 - Active Item Background Color-----------------------------------------------
            let itemColorRow = new PW.FrameBoxRow();
            let itemColorLabel = new Gtk.Label({
                label: _('Active Item Background Color'),
                xalign:0,
                hexpand: true,
            });   
            let itemColorChooser = new Gtk.ColorButton({use_alpha:true});     
            color = new Gdk.RGBA();
            color.parse(this.highlightColor);
            itemColorChooser.set_rgba(color);            
            itemColorChooser.connect('color-set', () => {
                this.highlightColor = itemColorChooser.get_rgba().to_string();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            itemColorRow.add(itemColorLabel);
            itemColorRow.add(itemColorChooser);
            themeSettingsFrame.append(itemColorRow);

            //ROW 7 - Active Item Foreground Color-----------------------------------------------
            let itemForegroundColorRow = new PW.FrameBoxRow();
            let itemForegroundColorLabel = new Gtk.Label({
                label: _('Active Item Foreground Color'),
                xalign:0,
                hexpand: true,
            });   
            let itemForegroundColorChooser = new Gtk.ColorButton({use_alpha:true});     
            color = new Gdk.RGBA();
            color.parse(this.highlightForegroundColor);
            itemForegroundColorChooser.set_rgba(color);            
            itemForegroundColorChooser.connect('color-set', () => {
                this.highlightForegroundColor = itemForegroundColorChooser.get_rgba().to_string();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            itemForegroundColorRow.add(itemForegroundColorLabel);
            itemForegroundColorRow.add(itemForegroundColorChooser);
            themeSettingsFrame.append(itemForegroundColorRow);

            //ROW 8 - Corner Radius-----------------------------------------------------
            let cornerRadiusRow = new PW.FrameBoxRow();
            let cornerRadiusLabel = new Gtk.Label({
                label: _('Corner Radius'),
                xalign:0,
                hexpand: true,
            }); 
            let cornerScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({ lower: 0,upper: 20, step_increment: 1, page_increment: 1, page_size: 0}),
                digits: 0, round_digits: 0, hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            cornerScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
            cornerScale.set_value(this.cornerRadius);
            cornerScale.connect('value-changed', () => {
                this.cornerRadius = cornerScale.get_value();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });   
            cornerRadiusRow.add(cornerRadiusLabel);
            cornerRadiusRow.add(cornerScale);
            themeSettingsFrame.append(cornerRadiusRow);

            //ROW 9 - Menu Arrow Size-------------------------------------------------------
            let menuMarginRow = new PW.FrameBoxRow();
            let menuMarginLabel = new Gtk.Label({
                label: _('Menu Arrow Size'),
                xalign:0,
                hexpand: true,
            });   
            let marginScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({ lower: 0,upper: 30, step_increment: 1, page_increment: 1, page_size: 0}),
                digits: 0, round_digits: 0, hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            marginScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
            marginScale.set_value(this.menuMargin);
            marginScale.connect('value-changed', () => {
                this.menuMargin = marginScale.get_value();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });   
            menuMarginRow.add(menuMarginLabel);
            menuMarginRow.add(marginScale);
            themeSettingsFrame.append(menuMarginRow);

            //ROW 10 - Menu Displacement------------------------------------------------------
            let menuArrowRow = new PW.FrameBoxRow();
            let menuArrowLabel = new Gtk.Label({
                label: _('Menu Displacement'),
                xalign:0,
                hexpand: true,
            });   
            let arrowScale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: new Gtk.Adjustment({ lower: 0,upper: 20, step_increment: 1, page_increment: 1, page_size: 0}),
                digits: 0, round_digits: 0, hexpand: true,
                draw_value: true,
                value_pos: Gtk.PositionType.RIGHT
            });
            arrowScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
            arrowScale.set_value(this.menuArrowSize);
            arrowScale.connect('value-changed', () => {
                this.menuArrowSize = arrowScale.get_value();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });   
            menuArrowRow.add(menuArrowLabel);
            menuArrowRow.add(arrowScale);
            themeSettingsFrame.append(menuArrowRow);

            //ROW 11 - Vertical Separator------------------------------------------------------
            let vertSeparatorRow = new PW.FrameBoxRow();
            let vertSeparatorLabel = new Gtk.Label({
                label: _('Enable Vertical Separator'),
                use_markup: true,
                xalign: 0,
                hexpand: true,
                selectable: false
             });   
            let vertSeparatorSwitch = new Gtk.Switch({ halign: Gtk.Align.END});
            vertSeparatorSwitch.set_active(this.verticalSeparator);
            vertSeparatorSwitch.connect('notify::active', (widget) => {
                this.verticalSeparator = widget.get_active();
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                applyButton.set_sensitive(true);
                resetButton.set_sensitive(true);
            });
            vertSeparatorRow.add(vertSeparatorLabel);            
            vertSeparatorRow.add(vertSeparatorSwitch);             
            themeSettingsFrame.append(vertSeparatorRow);

            //ROW 12 - Separator Color------------------------------------------------------
            let separatorColorRow = new PW.FrameBoxRow();
            let separatorColorLabel = new Gtk.Label({
                label: _('Separator Color'),
                use_markup: true,
                xalign: 0,
                hexpand: true,
                selectable: false
            });
            let colorChooser = new Gtk.ColorButton({use_alpha:true});     
            color = new Gdk.RGBA();
            color.parse(this.separatorColor);
            colorChooser.set_rgba(color);    
            colorChooser.connect('color-set', ()=>{
                this.separatorColor = colorChooser.get_rgba().to_string();
                applyButton.set_sensitive(true);
                if(this.shouldDeselect)
                    this.checkIfPresetMatch();
                resetButton.set_sensitive(true);
            });
            separatorColorRow.add(separatorColorLabel);            
            separatorColorRow.add(colorChooser);             
            themeSettingsFrame.append(separatorColorRow);

            let buttonRow = new Gtk.Box({
                valign: Gtk.Align.END,
                vexpand: true
            });
            let resetButton = new Gtk.Button({
                label: _("Restore Defaults"),
                tooltip_text: _("Restore the default settings on this page"),
                valign: Gtk.Align.END,
                vexpand: true
            });   
            resetButton.set_sensitive( this.checkIfResetButtonSensitive());
            resetButton.connect('clicked', ()=> {
                this.separatorColor = "rgb(63,62,64)";
                this.verticalSeparator = false;
                this.menuColor = "rgba(28, 28, 28, 0.98)";
                this.menuForegroundColor = "rgba(211, 218, 227, 1)";
                this.borderColor = "rgb(63,62,64)";
                this.highlightColor = "rgba(238, 238, 236, 0.1)";
                this.highlightForegroundColor = "rgba(255,255,255,1)";
                this.fontSize = 9;
                this.borderSize = 0;
                this.cornerRadius = 0;
                this.menuMargin = 0;
                this.menuArrowSize = 0;
                color.parse(this.menuColor);
                menuBackgroudColorChooser.set_rgba(color);

                color.parse(this.menuForegroundColor);
                menuForegroundColorChooser.set_rgba(color); 

                fontScale.set_value(this.fontSize); 

                color.parse(this.borderColor);
                borderColorChooser.set_rgba(color); 

                borderScale.set_value(this.borderSize);

                color.parse(this.highlightColor);
                itemColorChooser.set_rgba(color);

                color.parse(this.highlightForegroundColor);
                itemForegroundColorChooser.set_rgba(color);

                cornerScale.set_value(this.cornerRadius);
                marginScale.set_value(this.menuMargin);
                arrowScale.set_value(this.menuArrowSize);

                vertSeparatorSwitch.set_active(this.verticalSeparator);
                color.parse(this.separatorColor);
                colorChooser.set_rgba(color);    

                resetButton.set_sensitive(false);
                applyButton.set_sensitive(true);               
            });
 
            
            let applyButton = new Gtk.Button({
                label: _("Apply"),
                hexpand: true,
                halign: Gtk.Align.END
            });
            applyButton.connect('clicked', ()=> {
                applyButton.set_sensitive(false); 
                this.emit('menu-theme-response', -10);
            });
            applyButton.set_sensitive(false);

            buttonRow.append(resetButton);
            buttonRow.append(applyButton);

            vbox.append(customArcMenuOptionsFrame);
            vbox.append(buttonRow);   
        }
        get_response(){
            return this.addResponse;
        }
        checkIfPresetMatch(){
            this.presetName = "Custom Theme";
            let currentSettingsArray = [this.menuColor, this.menuForegroundColor, this.borderColor, this.highlightColor, this.highlightForegroundColor, this.separatorColor, 
                                        this.fontSize.toString(), this.borderSize.toString(), this.cornerRadius.toString(), this.menuArrowSize.toString(), 
                                        this.menuMargin.toString(), this.verticalSeparator.toString()];
            let all_color_themes = this._settings.get_value('color-themes').deep_unpack();
            for(let i = 0;i < all_color_themes.length;i++){
                this.isEqual=true;
                for(let l = 0; l<currentSettingsArray.length;l++){
                    if(currentSettingsArray[l] != all_color_themes[i][l+1]){
                        this.isEqual=false;
                        break;
                    }
                }
                if(this.isEqual){
                    this.presetName = all_color_themes[i][0];
                    this.updatePresetComboBox = false;
                    this.colorPresetCombo.set_active(i);
                    this.saveButton.set_sensitive(false);
                    this.updatePresetComboBox = true;
                    break;
                }      
            }
            if(!this.isEqual){
                this.saveButton.set_sensitive(true);
                this.colorPresetCombo.set_active(-1);
            } 
        }
        checkIfResetButtonSensitive(){
            return (this.menuColor != "rgba(28, 28, 28, 0.98)"||
            this.menuForegroundColor != "rgba(211, 218, 227, 1)"||
            this.borderColor != "rgb(63,62,64)"||
            this.highlightColor != "rgba(238, 238, 236, 0.1)"||
            this.highlightForegroundColor != "rgba(255,255,255,1)"||
            this.fontSize != 9||
            this.borderSize != 0||
            this.cornerRadius != 0||
            this.menuMargin != 0||
            this.menuArrowSize != 0 ||
            this.verticalSeparator != false ||
            this.separatorColor != "rgb(63,62,64)") ? true : false
        }
});

var MenuSettingsShortcutDirectoriesPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsShortcutDirectoriesPage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
        });

        this.set_child(this.mainBox);
        this._settings = settings;
        let softwareShortcutsFrame = new PW.FrameBox();
        this.softwareShortcutsScrollWindow = new Gtk.ScrolledWindow({
            valign: Gtk.Align.FILL,
            vexpand: true
        });
        this.softwareShortcutsScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
        this.softwareShortcutsScrollWindow.set_min_content_height(300);
        this.softwareShortcutsScrollWindow.set_child(softwareShortcutsFrame);

        let applicationShortcuts = this._settings.get_value('directory-shortcuts-list').deep_unpack();

        this.resetButton = new Gtk.Button({
            label: _("Restore Defaults"),
            tooltip_text: _("Restore the default settings on this page")
        });
        this.saveButton = new Gtk.Button({
            label: _("Apply"),
            hexpand: true
        });

        this._loadPinnedApps(applicationShortcuts,softwareShortcutsFrame);
        this.mainBox.append(this.softwareShortcutsScrollWindow);

        let addPinnedAppsFrame = new PW.FrameBox();
        let addPinnedAppsFrameRow = new PW.FrameBoxRow();
        let addPinnedAppsFrameLabel = new Gtk.Label({
            label: _("Add Default User Directories"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let addPinnedAppsButton = new PW.Button({
            icon_name: 'list-add-symbolic',
            tooltip_text: _("Browse a list of all default User Directories to add to your Directories Shortcuts")
        });
        addPinnedAppsButton.connect('clicked', ()=> {
            let dialog = new AddAppsToPinnedListWindow(this._settings, this, Constants.DIALOG_TYPE.Directories_Shortcuts);
            dialog.show();
            dialog.connect('response', ()=> { 
                if(dialog.get_response()) {
                    let newPinnedApps = dialog.get_newPinnedAppsArray();
                    let array=[]; 
                    for(let i = 0;i<newPinnedApps.length;i++){
                        array.push([newPinnedApps[i]._name,newPinnedApps[i]._icon,newPinnedApps[i]._cmd]);
                    }
                    this._loadPinnedApps(array,softwareShortcutsFrame);
                    dialog.destroy();
                    softwareShortcutsFrame.show();
                    this.saveButton.set_sensitive(true);
                }
                else
                    dialog.destroy();
            }); 
        });
        addPinnedAppsFrameRow.add(addPinnedAppsFrameLabel);
        addPinnedAppsFrameRow.add(addPinnedAppsButton);
        addPinnedAppsFrame.add(addPinnedAppsFrameRow);
        this.mainBox.append(addPinnedAppsFrame);
        
        let addCustomAppFrame = new PW.FrameBox();
        let addCustomAppFrameRow = new PW.FrameBoxRow();
        let addCustomAppFrameLabel = new Gtk.Label({
            label: _("Add Custom Shortcut"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let addCustomAppButton = new PW.Button({
            icon_name: 'list-add-symbolic',
            tooltip_text: _("Create a custom shortcut to add to your Directories Shortcuts")
        });
        addCustomAppButton.connect('clicked', ()=> {
            let dialog = new AddCustomLinkDialogWindow(this._settings, this, Constants.DIALOG_TYPE.Directories_Shortcuts);
            dialog.show();
            dialog.connect('response', ()=> { 
                if(dialog.get_response()) {
                    let newPinnedApps = dialog.get_newPinnedAppsArray();
                    this._loadPinnedApps([newPinnedApps],softwareShortcutsFrame);
                    dialog.destroy();
                    softwareShortcutsFrame.show();
                    this.saveButton.set_sensitive(true);
                }
                else
                    dialog.destroy();
            }); 
        });
        addCustomAppFrameRow.add(addCustomAppFrameLabel);
        addCustomAppFrameRow.add(addCustomAppButton);
        addCustomAppFrame.add(addCustomAppFrameRow);
        this.mainBox.append(addCustomAppFrame);

        let buttonRow = new Gtk.Box({
            valign: Gtk.Align.END,
            vexpand: false
        });

        this.resetButton.set_sensitive(this.getSensitive());

        this.resetButton.connect('clicked', ()=> {
            this.saveButton.set_sensitive(true);
            softwareShortcutsFrame.remove_all_children();
            this._loadPinnedApps(this._settings.get_default_value('directory-shortcuts-list').deep_unpack(), softwareShortcutsFrame);
            softwareShortcutsFrame.show();
            this.resetButton.set_sensitive(false);
        });

        this.saveButton.connect('clicked', ()=> {
            let array = [];
            for(let i = 0; i < softwareShortcutsFrame.count; i++) {
                let frame = softwareShortcutsFrame.get_index(i);
                array.push([frame._name, frame._icon, frame._cmd]);
            }
            this._settings.set_value('directory-shortcuts-list', new GLib.Variant('aas', array));
            this.saveButton.set_sensitive(false);
            this.resetButton.set_sensitive(this.getSensitive());
        }); 
        this.saveButton.set_halign(Gtk.Align.END);
        this.saveButton.set_sensitive(false);
        buttonRow.append(this.resetButton);
        buttonRow.append(this.saveButton);
        this.mainBox.append(buttonRow);
    }

    getSensitive(){
        let defaultShortcuts = this._settings.get_default_value('directory-shortcuts-list').deep_unpack();
        let currentShortcuts = this._settings.get_value('directory-shortcuts-list').deep_unpack();
        return !Utils.getArraysEqual(defaultShortcuts, currentShortcuts);
    }

    _loadPinnedApps(applicationShortcuts,softwareShortcutsFrame){
        for(let i = 0; i < applicationShortcuts.length; i++){
            let applicationName = _(applicationShortcuts[i][0]);
            let editable = true;
            if(applicationShortcuts[i][2].startsWith("ArcMenu_")){
                editable = false;
            }

            let frameRow = new PW.FrameBoxDragRow(this.softwareShortcutsScrollWindow);
            frameRow._name = applicationName;
            frameRow._icon = applicationShortcuts[i][1];   
            frameRow._gicon = Gio.icon_new_for_string(getIconPath(applicationShortcuts[i]));
            frameRow._cmd = applicationShortcuts[i][2];
            frameRow.saveButton = this.saveButton;
            frameRow.resetButton = this.resetButton;

            let applicationIcon = new Gtk.Image( {
                gicon: frameRow._gicon,
                pixel_size: 22
            });
            let applicationImageBox = new Gtk.Box({
                margin_start: 0,
                hexpand: false,
                vexpand: false,
                spacing: 5,
            });
            let dragImage = new Gtk.Image( {
                gicon: Gio.icon_new_for_string("list-drag-handle-symbolic"),
                pixel_size: 12
            });
            applicationImageBox.append(dragImage);
            applicationImageBox.append(applicationIcon);
            frameRow.add(applicationImageBox);

            let softwareShortcutsLabel = new Gtk.Label({
                label: _(applicationName),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            let buttonBox = new PW.EditEntriesBox({
                frameRow: frameRow, 
                frame: softwareShortcutsFrame, 
                buttons: [this.resetButton, this.saveButton],
                modifyButton: editable,
                deleteButton: true
            });

            if(editable){
                buttonBox.connect('modify', ()=> {
                    let appArray = [frameRow._name,frameRow._icon,frameRow._cmd];
                    let dialog = new AddCustomLinkDialogWindow(this._settings, this, Constants.DIALOG_TYPE.Directories_Shortcuts, true, appArray);
                    dialog.show();
                    dialog.connect('response', ()=> { 
                        if(dialog.get_response()) {
                            let newApplicationShortcut = dialog.get_newPinnedAppsArray();
                            frameRow._name = newApplicationShortcut[0];
                            frameRow._icon = newApplicationShortcut[1];
                            frameRow._cmd = newApplicationShortcut[2];
                            softwareShortcutsLabel.label = _(frameRow._name);
                            applicationIcon.gicon = Gio.icon_new_for_string(frameRow._icon);
                            dialog.destroy();
                            softwareShortcutsFrame.show();
                            this.resetButton.set_sensitive(true);
                            this.saveButton.set_sensitive(true);
                        }
                        else
                            dialog.destroy();
                    });  
                });
            }
            
            frameRow.add(softwareShortcutsLabel);
            frameRow.add(buttonBox);
            softwareShortcutsFrame.add(frameRow);
        }
    }
});
var MenuSettingsShortcutApplicationsPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsShortcutApplicationsPage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: true,
                valign: Gtk.Align.FILL
        });

        this.set_child(this.mainBox);
        this._settings = settings;
        let softwareShortcutsFrame = new PW.FrameBox();
        this.softwareShortcutsScrollWindow = new Gtk.ScrolledWindow({
            valign: Gtk.Align.FILL,
            vexpand: true
        });
        this.softwareShortcutsScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
        this.softwareShortcutsScrollWindow.set_min_content_height(300);
        this.softwareShortcutsScrollWindow.set_child(softwareShortcutsFrame);

        let applicationShortcuts = this._settings.get_value('application-shortcuts-list').deep_unpack();

        this.resetButton = new Gtk.Button({
            label: _("Restore Defaults"),
            tooltip_text: _("Restore the default settings on this page")
        });  
        this.saveButton = new Gtk.Button({
            label: _("Apply"),
            hexpand: true
        });

        this._loadPinnedApps(applicationShortcuts,softwareShortcutsFrame);
        this.mainBox.append(this.softwareShortcutsScrollWindow);

        let addPinnedAppsFrame = new PW.FrameBox();
        let addPinnedAppsFrameRow = new PW.FrameBoxRow();
        let addPinnedAppsFrameLabel = new Gtk.Label({
            label: _("Add More Apps"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let addPinnedAppsButton = new PW.Button({
            icon_name: 'list-add-symbolic',
            tooltip_text: _("Browse a list of all applications to add to your Application Shortcuts")
        });
        addPinnedAppsButton.connect('clicked', ()=> {
            let dialog = new AddAppsToPinnedListWindow(this._settings, this, Constants.DIALOG_TYPE.Application_Shortcuts);
            dialog.show();
            dialog.connect('response', ()=> { 
                if(dialog.get_response()) {
                    let newPinnedApps = dialog.get_newPinnedAppsArray();
                    let array=[]; 
                    for(let i = 0;i<newPinnedApps.length;i++){
                        array.push([newPinnedApps[i]._name,newPinnedApps[i]._icon,newPinnedApps[i]._cmd]);
                    }
                    this._loadPinnedApps(array,softwareShortcutsFrame);
                    dialog.destroy();
                    softwareShortcutsFrame.show();
                    this.saveButton.set_sensitive(true);
                }
                else
                    dialog.destroy();
            }); 
        });
        addPinnedAppsFrameRow.add(addPinnedAppsFrameLabel);
        addPinnedAppsFrameRow.add(addPinnedAppsButton);
        addPinnedAppsFrame.add(addPinnedAppsFrameRow);
        this.mainBox.append(addPinnedAppsFrame);
        
        let addCustomAppFrame = new PW.FrameBox();
        let addCustomAppFrameRow = new PW.FrameBoxRow();
        let addCustomAppFrameLabel = new Gtk.Label({
            label: _("Add Custom Shortcut"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let addCustomAppButton = new PW.Button({
            icon_name: 'list-add-symbolic',
            tooltip_text: _("Create a custom shortcut to add to your Application Shortcuts")
        });
        addCustomAppButton.connect('clicked', ()=> {
            let dialog = new AddCustomLinkDialogWindow(this._settings, this, Constants.DIALOG_TYPE.Application_Shortcuts);
            dialog.show();
            dialog.connect('response', ()=> { 
                if(dialog.get_response()) {
                    let newPinnedApps = dialog.get_newPinnedAppsArray();
                    this._loadPinnedApps([newPinnedApps],softwareShortcutsFrame);
                    dialog.destroy();
                    softwareShortcutsFrame.show();
                    this.saveButton.set_sensitive(true);
                }
                else
                    dialog.destroy();
            }); 
        });
        addCustomAppFrameRow.add(addCustomAppFrameLabel);
        addCustomAppFrameRow.add(addCustomAppButton);
        addCustomAppFrame.add(addCustomAppFrameRow);
        this.mainBox.append(addCustomAppFrame);

        let buttonRow = new Gtk.Box({
            valign: Gtk.Align.END,
            vexpand: false
        });
         

        this.resetButton.set_sensitive(this.getSensitive());

        this.resetButton.connect('clicked', ()=> {
            this.saveButton.set_sensitive(true);
            softwareShortcutsFrame.remove_all_children();
            this._loadPinnedApps(this._settings.get_default_value('application-shortcuts-list').deep_unpack(), softwareShortcutsFrame);
            softwareShortcutsFrame.show();
            this.resetButton.set_sensitive(false);
        });

        this.saveButton.connect('clicked', ()=> {
            let array = [];
            for(let i = 0; i < softwareShortcutsFrame.count; i++) {
                let frame = softwareShortcutsFrame.get_index(i);
                array.push([frame._name,frame._icon, frame._cmd]);
            }
            this._settings.set_value('application-shortcuts-list', new GLib.Variant('aas', array));
            this.saveButton.set_sensitive(false);
            this.resetButton.set_sensitive(this.getSensitive());
        }); 
        this.saveButton.set_halign(Gtk.Align.END);
        this.saveButton.set_sensitive(false);
        buttonRow.append(this.resetButton);
        buttonRow.append(this.saveButton);
        this.mainBox.append(buttonRow);
    }

    getSensitive(){
        let defaultShortcuts = this._settings.get_default_value('application-shortcuts-list').deep_unpack();
        let currentShortcuts = this._settings.get_value('application-shortcuts-list').deep_unpack();
        return !Utils.getArraysEqual(defaultShortcuts, currentShortcuts);
    }

    _loadPinnedApps(applicationShortcuts,softwareShortcutsFrame){
        for(let i = 0; i < applicationShortcuts.length; i++){
            let applicationName = applicationShortcuts[i][0];

            let frameRow = new PW.FrameBoxDragRow(this.softwareShortcutsScrollWindow);
            let iconString;
            frameRow._name = applicationShortcuts[i][0];
            frameRow._icon = applicationShortcuts[i][1];
            frameRow._cmd = applicationShortcuts[i][2];
            frameRow.saveButton = this.saveButton;
            frameRow.resetButton = this.resetButton;
            iconString = frameRow._icon;
            if(frameRow._icon === "" && Gio.DesktopAppInfo.new(frameRow._cmd)){
                iconString = Gio.DesktopAppInfo.new(frameRow._cmd).get_icon() ? Gio.DesktopAppInfo.new(frameRow._cmd).get_icon().to_string() : "";
            }
            frameRow._gicon = Gio.icon_new_for_string(iconString);
            let applicationIcon = new Gtk.Image( {
                gicon: frameRow._gicon,
                pixel_size: 22
            });
            let applicationImageBox = new Gtk.Box( {
                margin_start: 0,
                hexpand: false,
                vexpand: false,
                spacing: 5,
            });
            let dragImage = new Gtk.Image( {
                gicon: Gio.icon_new_for_string("list-drag-handle-symbolic"),
                pixel_size: 12
            });
            applicationImageBox.append(dragImage);
            applicationImageBox.append(applicationIcon);
            frameRow.add(applicationImageBox);

            let softwareShortcutsLabel = new Gtk.Label({
                label: _(applicationName),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });

            checkIfValidShortcut(frameRow, softwareShortcutsLabel, applicationIcon);

            let buttonBox = new PW.EditEntriesBox({
                frameRow: frameRow, 
                frame: softwareShortcutsFrame, 
                buttons: [this.saveButton, this.resetButton],
                modifyButton: true,
                deleteButton: true
            });
            
            buttonBox.connect('modify', ()=> {
                let appArray = [frameRow._name,frameRow._icon,frameRow._cmd];
                let dialog = new AddCustomLinkDialogWindow(this._settings, this, Constants.DIALOG_TYPE.Application_Shortcuts, true, appArray);
                dialog.show();
                dialog.connect('response', ()=> { 
                    if(dialog.get_response()) {
                        let newApplicationShortcut = dialog.get_newPinnedAppsArray();
                        frameRow._name = newApplicationShortcut[0];
                        frameRow._icon = newApplicationShortcut[1];
                        frameRow._cmd = newApplicationShortcut[2];
                        softwareShortcutsLabel.label = _(frameRow._name);
                        let iconString;
                        if(frameRow._icon === "" && Gio.DesktopAppInfo.new(frameRow._cmd)){
                            iconString = Gio.DesktopAppInfo.new(frameRow._cmd).get_icon() ? Gio.DesktopAppInfo.new(frameRow._cmd).get_icon().to_string() : "";
                        }
                        applicationIcon.gicon = Gio.icon_new_for_string(iconString ? iconString : frameRow._icon);
                        dialog.destroy();
                        softwareShortcutsFrame.show();
                        this.resetButton.set_sensitive(true);
                        this.saveButton.set_sensitive(true);
                    }
                    else
                        dialog.destroy();
                });  
            });
            
            frameRow.add(softwareShortcutsLabel);
            frameRow.add(buttonBox);
            softwareShortcutsFrame.add(frameRow);
        }
    }
});
var MenuSettingsShortcutSessionButtonsPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsShortcutSessionButtonsPage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: false,
                valign: Gtk.Align.START
        });

        this.set_child(this.mainBox);
        this._settings = settings;

        let sessionButtonsFrame = new PW.FrameBox();
        this.mainBox.append(sessionButtonsFrame);
        let suspendRow = new PW.FrameBoxRow();
        let suspendLabel = new Gtk.Label({
            label: _("Suspend"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let suspendButton = new Gtk.Switch();
        if(this._settings.get_boolean('show-suspend-button'))
            suspendButton.set_active(true);
        suspendButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-suspend-button', widget.get_active());
        });
        suspendRow.add(suspendLabel);
        suspendRow.add(suspendButton);
        
        let lockRow = new PW.FrameBoxRow();
        let lockLabel = new Gtk.Label({
            label: _("Lock"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let lockButton = new Gtk.Switch();
        if(this._settings.get_boolean('show-lock-button'))
            lockButton.set_active(true);
        lockButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-lock-button', widget.get_active());
        });
        lockRow.add(lockLabel);
        lockRow.add(lockButton);
        
        let logOffRow = new PW.FrameBoxRow();
        let logOffLabel = new Gtk.Label({
            label: _("Log Out"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let logOffButton = new Gtk.Switch();
        if(this._settings.get_boolean('show-logout-button'))
            logOffButton.set_active(true);
        logOffButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-logout-button', widget.get_active());
        });   
        logOffRow.add(logOffLabel);
        logOffRow.add(logOffButton);

        let restartRow = new PW.FrameBoxRow();
        let restartLabel = new Gtk.Label({
            label: _("Restart"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let restartButton = new Gtk.Switch();
        if(this._settings.get_boolean('show-restart-button'))
            restartButton.set_active(true);
        restartButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-restart-button', widget.get_active());
        });   
        restartRow.add(restartLabel);
        restartRow.add(restartButton);

        let powerRow = new PW.FrameBoxRow();
        let powerLabel = new Gtk.Label({
            label: _("Power Off"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let powerButton = new Gtk.Switch();
        if(this._settings.get_boolean('show-power-button'))
            powerButton.set_active(true);
        powerButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-power-button', widget.get_active());
        });   
        powerRow.add(powerLabel);
        powerRow.add(powerButton);

        sessionButtonsFrame.add(suspendRow);
        sessionButtonsFrame.add(logOffRow);
        sessionButtonsFrame.add(lockRow);
        sessionButtonsFrame.add(restartRow);
        sessionButtonsFrame.add(powerRow);
    }
});

var MenuSettingsShortcutExtrasPage = GObject.registerClass(
    class Arc_Menu_MenuSettingsShortcutExtrasPage extends Gtk.ScrolledWindow {
    _init(settings) {
        super._init();
        this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

        this.mainBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 24,
                margin_bottom: 24,
                margin_start: 24,
                margin_end: 24,
                spacing: 20,
                vexpand: false,
                valign: Gtk.Align.START
        });

        this.set_child(this.mainBox);
        this._settings = settings;
        let placesFrame = new PW.FrameBox();
        let externalDeviceRow = new PW.FrameBoxRow();
        let externalDeviceLabel = new Gtk.Label({
            label: _("External Devices"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        
        let externalDeviceButton = new Gtk.Switch({tooltip_text:_("Show all connected external devices in ArcMenu")});
        if(this._settings.get_boolean('show-external-devices'))
            externalDeviceButton.set_active(true);
        externalDeviceButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-external-devices', widget.get_active());
        });   
        externalDeviceRow.add(externalDeviceLabel);
        externalDeviceRow.add(externalDeviceButton);

        placesFrame.add(externalDeviceRow);
              
        let bookmarksRow = new PW.FrameBoxRow();
        let bookmarksLabel = new Gtk.Label({
            label: _("Bookmarks"),
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        
        let bookmarksButton = new Gtk.Switch({tooltip_text:_("Show all Nautilus bookmarks in ArcMenu")});
        if(this._settings.get_boolean('show-bookmarks'))
            bookmarksButton.set_active(true);
        bookmarksButton.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-bookmarks', widget.get_active());
        });   
        bookmarksRow.add(bookmarksLabel);
        bookmarksRow.add(bookmarksButton);

        placesFrame.add(bookmarksRow);   
        this.mainBox.append(placesFrame); 
    }
});

var MiscPage = GObject.registerClass(
    class Arc_Menu_MiscPage extends PW.NotebookPage {
        _init(settings, parentBox) {
            super._init(_('Misc'));
            this._settings = settings;

            let settingsHeaderLabel = new Gtk.Label({
                label: "<b>" + _('Export or Import Settings') +"</b>",
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            this.append(settingsHeaderLabel);

            let importFrame = new PW.FrameBox();
            let importRow = new PW.FrameBoxRow();
            let importLabel = new Gtk.Label({
                label: _("All ArcMenu Settings"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            
            let settingsImportInfoButton = new PW.Button({
                icon_name: 'info-circle-symbolic'
            });
            settingsImportInfoButton.connect('clicked', ()=> {
                let dialog = new PW.MessageDialog({
                    text: _("Export or Import All ArcMenu Settings"),
                    secondaryText: _('Importing settings from file may replace ALL saved settings.\nThis includes all saved pinned apps.'),
                    buttons: Gtk.ButtonsType.OK,
                    transient_for: this.get_root()
                });
                dialog.connect ('response', ()=> dialog.destroy());
                dialog.show();
            });

            let importButtonsRow = new PW.FrameBoxRow();
            let importButton = new Gtk.Button({
                label: _("Import from File"),
                hexpand: true,
                vexpand: true,
                tooltip_text: _("Import ArcMenu settings from a file")  
            });
            importButton.connect('clicked', ()=> {
                this._showFileChooser(
                    _('Import settings'),
                    { action: Gtk.FileChooserAction.OPEN },
                    "_Open",
                    filename => {
                        let settingsFile = Gio.File.new_for_path(filename);
                        let [ , pid, stdin, stdout, stderr] = 
                            GLib.spawn_async_with_pipes(
                                null,
                                ['dconf', 'load', SCHEMA_PATH],
                                null,
                                GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                                null
                            );
            
                        stdin = new Gio.UnixOutputStream({ fd: stdin, close_fd: true });
                        GLib.close(stdout);
                        GLib.close(stderr);
                                            
                        let [ , , , retCode] = GLib.spawn_command_line_sync(GSET + ' -d ' + Me.uuid);
                                            
                        if (retCode == 0) {
                            GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, () => GLib.spawn_command_line_sync(GSET + ' -e ' + Me.uuid));
                        }
    
                        stdin.splice(settingsFile.read(null), Gio.OutputStreamSpliceFlags.CLOSE_SOURCE | Gio.OutputStreamSpliceFlags.CLOSE_TARGET, null);
                    }
                );
            });
            let exportButton = new Gtk.Button({
                label: _("Export to File"),
                hexpand: true,
                vexpand: true,
                tooltip_text: _("Export and save all your ArcMenu settings to a file")  
            });
            exportButton.connect('clicked', ()=> {
                this._showFileChooser(
                    _('Export settings'),
                    { action: Gtk.FileChooserAction.SAVE},
                    "_Save",
                    (filename) => {
                        let file = Gio.file_new_for_path(filename);
                        let raw = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
                        let out = Gio.BufferedOutputStream.new_sized(raw, 4096);
                        out.write_all(GLib.spawn_command_line_sync('dconf dump ' + SCHEMA_PATH)[1], null);
                        out.close(null);
                    }
                );
            });

            importRow.add(importLabel);
            importRow.add(settingsImportInfoButton);
            importButtonsRow.add(exportButton);
            importButtonsRow.add(importButton);
            importFrame.add(importRow);     
            importFrame.add(importButtonsRow);
            this.append(importFrame);

            let importColorPresetFrame = new PW.FrameBox();
            let importColorPresetRow = new PW.FrameBoxRow();
            let importColorPresetLabel = new Gtk.Label({
                label: _("Menu Theme Presets"),
                use_markup: true,
                xalign: 0,
                hexpand: true
            });
            
            let colorThemesImportInfoButton = new PW.Button({
                icon_name: 'info-circle-symbolic'
            });
            colorThemesImportInfoButton.connect('clicked', ()=> {
                let dialog = new PW.MessageDialog({
                    text: _("Export or Import Menu Theme Presets"),
                    secondaryText: _('Menu theme presets are located in the "Menu Theme" section'),
                    buttons: Gtk.ButtonsType.OK,
                    transient_for: this.get_root()
                });
                dialog.connect ('response', ()=> dialog.destroy());
                dialog.show();
            });

            let importColorPresetButtonsRow = new PW.FrameBoxRow();
            let importColorPresetButton = new Gtk.Button({
                label: _("Import Theme Preset"),
                hexpand: true,
                vexpand: true,
                tooltip_text: _("Import ArcMenu Theme Presets from a file")  
            });
            importColorPresetButton.connect('clicked', ()=> {
                this._showFileChooser(
                    _('Import Theme Preset'),
                    { action: Gtk.FileChooserAction.OPEN },
                    "_Open",
                    filename => {
                        let settingsFile = Gio.File.new_for_path(filename);
                        let [ success, content, etags] = settingsFile.load_contents(null);
                        let string = content.toString();
                        let themes = string.split("\n")
                        themes.pop(); //remove last blank array 
                        this.color_themes = [];
                        for(let i = 0; i < themes.length; i++){
                            let array = themes[i].split('//')
                            array.pop();
                            this.color_themes.push(array);
                        }
                        let dialog = new ExportColorThemeDialogWindow(this._settings, this, this.color_themes);
                        dialog.show();
                        dialog.connect('response', (response) => { 
                            if(dialog.get_response()){
                                let selectedThemes = dialog.selectedThemes;
                                this.color_themes = this._settings.get_value('color-themes').deep_unpack();
                                for(let i = 0; i < selectedThemes.length; i++){
                                    this.color_themes.push(selectedThemes[i]);
                                }
                                
                                this._settings.set_value('color-themes',new GLib.Variant('aas',this.color_themes));
                        
                                dialog.destroy();
                            }
                            else
                                dialog.destroy();
                        });  
                    }
                );
            });
            let exportColorPresetButton = new Gtk.Button({
                label: _("Export Theme Preset"),
                hexpand: true,
                vexpand: true,
                tooltip_text: _("Export and save your ArcMenu Theme Presets to a file")  
            });
            exportColorPresetButton.connect('clicked', ()=> {
                let dialog = new ExportColorThemeDialogWindow(this._settings, this);
                dialog.show();
                dialog.connect('response', (response) => { 
                    if(dialog.get_response()){
                       this.selectedThemes = dialog.selectedThemes;
                       this._showFileChooser(
                            _('Export Theme Preset'),
                                { action: Gtk.FileChooserAction.SAVE },
                                    "_Save",
                                    (filename) => {
                                        let file = Gio.file_new_for_path(filename);
                                        let raw = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
                                        let out = Gio.BufferedOutputStream.new_sized(raw, 4096);
                                        for(let i = 0; i<this.selectedThemes.length; i++){
                                            for(let x = 0; x<this.selectedThemes[i].length;x++){
                                                out.write_all((this.selectedThemes[i][x]).toString()+"//", null);
                                            }
                                            out.write_all("\n", null);
                                        }
                                        out.close(null);
                                    }
                        );
                        dialog.destroy();
                    }
                    else
                        dialog.destroy();
                }); 
            });
            
            importColorPresetRow.add(importColorPresetLabel);
            importColorPresetRow.add(colorThemesImportInfoButton);
            importColorPresetButtonsRow.add(exportColorPresetButton);
            importColorPresetButtonsRow.add(importColorPresetButton);
            importColorPresetFrame.add(importColorPresetRow);   
            importColorPresetFrame.add(importColorPresetButtonsRow);
            this.append(importColorPresetFrame);

            let resetSettingsButton = new Gtk.Button({ 
                valign: Gtk.Align.END,
                halign: Gtk.Align.START,
                vexpand: true,
                hexpand: false,
                label: _("Reset all Settings"),
                tooltip_text: _('Reset all ArcMenu Settings to Default') 
            });
            let context = resetSettingsButton.get_style_context();
            context.add_class('suggested-action');
            resetSettingsButton.connect('clicked', (widget) => {
                let dialog = new Gtk.MessageDialog({
                    text: "<b>" + _("Restore Default Settings?") + '</b>\n' + _("All ArcMenu settings will be reset to the default value."),
                    use_markup: true,
                    buttons: Gtk.ButtonsType.YES_NO,
                    message_type: Gtk.MessageType.WARNING,
                    transient_for: this.get_root(),
                    modal: true
                });
                dialog.connect('response', (widget, response) => {
                    if(response == Gtk.ResponseType.YES){
                        GLib.spawn_command_line_sync('dconf reset -f /org/gnome/shell/extensions/arcmenu/');
                        let children = [...parentBox.settingsFrameStack];
                        for(let child of children){
                            parentBox.settingsFrameStack.remove(child);
                        }
                        parentBox.populateSettingsFrameStack();
                    }
                    dialog.destroy();
                });
                dialog.show();
            });

            this.append(resetSettingsButton);
        }
        _showFileChooser(title, params, acceptBtn, acceptHandler) {
            let dialog = new Gtk.FileChooserDialog({ 
                title: _(title),
                transient_for: this.get_root(), 
                modal: true,
                action: params.action,
            });
            dialog.add_button("_Cancel", Gtk.ResponseType.CANCEL);
            dialog.add_button(acceptBtn, Gtk.ResponseType.ACCEPT);
    
            dialog.connect("response", (self, response) => {
                if(response === Gtk.ResponseType.ACCEPT){
                    try {
                        acceptHandler(dialog.get_file().get_path());
                    } catch(e) {
                        log('error from ArcMenu filechooser: ' + e);
                    }
                }
                dialog.destroy();
            });

            dialog.show();
        }
    });
    function mergeObjects(main, bck) {
        for (var prop in bck) {
            if (!main.hasOwnProperty(prop) && bck.hasOwnProperty(prop)) {
                main[prop] = bck[prop];
            }
        }
        return main;
    };

var AboutPage = GObject.registerClass(
    class Arc_Menu_AboutPage extends Gtk.ScrolledWindow {
        _init(settings) {
            super._init();
            this.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
    
            this.mainBox = new Gtk.Box({
                    orientation: Gtk.Orientation.VERTICAL,
                    margin_start: 24,
                    margin_end: 24,
                    spacing: 0,
                    vexpand: true,
                    valign: Gtk.Align.FILL
            });
    
            this.set_child(this.mainBox);
            this._settings = settings;

            let releaseVersion;
            if(Me.metadata.version)
                releaseVersion = Me.metadata.version;
            else
                releaseVersion = 'unknown';

            let commitVersion;
            if(Me.metadata.commit)
                commitVersion = Me.metadata.commit;
                
            let projectUrl = Me.metadata.url;

            let arcMenuImage = new Gtk.Image({ 
                margin_bottom: 5,
                icon_name: 'arc-menu-logo',
                pixel_size: 100,
            });
            let arcMenuImageBox = new Gtk.Box( {
                orientation: Gtk.Orientation.VERTICAL,
                margin_top: 10,
                margin_bottom: 0,
                hexpand: false,
                vexpand: false
            });
            arcMenuImageBox.append(arcMenuImage);

            let extensionInfoFrame = new PW.FrameBox();

            let arcMenuVersionRow = new PW.FrameBoxRow({
                selectable: false,
                activatable: false
            });
            let versionText = new Gtk.Label({
                label: _('ArcMenu Version'),
            });
            let versionInfo = new Gtk.Label({
                label: releaseVersion + '',
                hexpand: true,
                sensitive: false,
                halign: Gtk.Align.END
            });
            arcMenuVersionRow.add(versionText);
            arcMenuVersionRow.add(versionInfo);
            extensionInfoFrame.add(arcMenuVersionRow);

            let commitRow = new PW.FrameBoxRow({
                selectable: false,
                activatable: false
            });
            let commitText = new Gtk.Label({
                label: _('Git Commit'),
            });
            let commitInfo = new Gtk.Label({
                label: commitVersion ? commitVersion : '',
                hexpand: true,
                sensitive: false,
                halign: Gtk.Align.END
            });
            commitRow.add(commitText);
            commitRow.add(commitInfo);
            if(commitVersion){
                extensionInfoFrame.add(createSeparator());
                extensionInfoFrame.add(commitRow);
            }

            let gnomeVersionRow = new PW.FrameBoxRow({
                selectable: false,
                activatable: false
            });
            let gnomeVersionText = new Gtk.Label({
                label: _('GNOME Version'),
            });
            let gnomeVersionInfo = new Gtk.Label({
                label: imports.misc.config.PACKAGE_VERSION + '',
                hexpand: true,
                sensitive: false,
                halign: Gtk.Align.END
            });
            gnomeVersionRow.add(gnomeVersionText);
            gnomeVersionRow.add(gnomeVersionInfo);
            extensionInfoFrame.add(createSeparator());
            extensionInfoFrame.add(gnomeVersionRow);

            let osRow = new PW.FrameBoxRow({
                selectable: false,
                activatable: false
            });
            let osText = new Gtk.Label({
                label: _('OS'),
            });
            let osInfoText;
            let name = GLib.get_os_info("NAME");
            let prettyName = GLib.get_os_info("PRETTY_NAME");
            if(prettyName)
                osInfoText = prettyName;
            else
                osInfoText = name;
            let versionID = GLib.get_os_info("VERSION_ID");
            if(versionID)
                osInfoText += "; Version ID: " + versionID;
            let buildID = GLib.get_os_info("BUILD_ID");
            if(buildID)
                osInfoText += "; " + "Build ID: " +buildID;

            let osInfo = new Gtk.Label({
                label: osInfoText,
                hexpand: true,
                sensitive: false,
                halign: Gtk.Align.END
            });
            osRow.add(osText);
            osRow.add(osInfo);
            extensionInfoFrame.add(createSeparator());
            extensionInfoFrame.add(osRow);

            let windowingRow = new PW.FrameBoxRow({
                selectable: false,
                activatable: false
            });
            let windowingText = new Gtk.Label({
                label: _('Session Type'),
            });
            let windowingLabel;
            if(Me.metadata.isWayland)
                windowingLabel = "Wayland";
            else
                windowingLabel = "X11";
          
            let windowingInfo = new Gtk.Label({
                label: windowingLabel,
                hexpand: true,
                sensitive: false,
                halign: Gtk.Align.END
            });
            windowingRow.add(windowingText);
            windowingRow.add(windowingInfo);
            extensionInfoFrame.add(createSeparator());
            extensionInfoFrame.add(windowingRow);
            
            let arcMenuInfoBox = new Gtk.Box( {
                orientation: Gtk.Orientation.VERTICAL,
                hexpand: false,
                vexpand: false
            });
            let arcMenuLabel = new Gtk.Label({
                label: '<span size="large"><b>' + _('ArcMenu') + '</b></span>',
                use_markup: true,
                vexpand: true,
                valign: Gtk.Align.FILL
            });
            
            let projectDescriptionLabel = new Gtk.Label({
                label: _('A Dynamic, Traditional, Modern Menu for GNOME'),
                hexpand: false,
                vexpand: false,
                margin_bottom: 5
            });
            let linksBox = new Gtk.Box({
                hexpand: false,
                vexpand: false,
                valign: Gtk.Align.START,
                halign: Gtk.Align.CENTER,
                margin_top: 0,
                margin_bottom: 0,
                margin_start: 0,
                margin_end: 0,
                spacing: 0,
            });

            let pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(Me.path + '/media/icons/prefs_icons/donate-icon.svg', 150, 50);
            let donateImage = Gtk.Picture.new_for_pixbuf(pixbuf);
            let donateLinkButton = new Gtk.LinkButton({
                child: donateImage,
                uri: 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=53CWA7NR743WC&item_name=Donate+to+support+my+work&currency_code=USD&source=url',
                tooltip_text: _("Donate to the ArcMenu Project")
            });

            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(Me.path + '/media/icons/prefs_icons/gitlab-icon.svg', 35, 35);
            let gitlabImage = Gtk.Picture.new_for_pixbuf(pixbuf);
            let projectLinkButton = new Gtk.LinkButton({
                child: gitlabImage,
                uri: projectUrl,
                tooltip_text: _("ArcMenu GitLab Page")
            });
            
            linksBox.append(projectLinkButton);
            linksBox.append(donateLinkButton);

            this.creditsScrollWindow = new Gtk.ScrolledWindow({
                margin_top: 10,
                margin_bottom: 0
            });
            this.creditsScrollWindow.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC);
            this.creditsScrollWindow.set_max_content_height(200);
            this.creditsScrollWindow.set_min_content_height(200);
            this.creditsFrame = new PW.Notebook();
            let developersPage = new PW.NotebookPage(_("Developers"));
            this.creditsFrame.append_page(developersPage);
            let translatorsPage = new PW.NotebookPage(_("Translators"));
            this.creditsFrame.append_page(translatorsPage);
            let contributorsPage = new PW.NotebookPage(_("Contributors"));
            this.creditsFrame.append_page(contributorsPage );
            let artworkPage = new PW.NotebookPage(_("Artwork"));
            this.creditsFrame.append_page(artworkPage);
            this.creditsScrollWindow.set_child(this.creditsFrame);
  	        let creditsLabel = new Gtk.Label({
		        label: _(Constants.DEVELOPERS),
		        use_markup: true,
		        halign: Gtk.Align.START,
                hexpand: false,
                vexpand: false,
            });
            developersPage.append(creditsLabel);
            creditsLabel = new Gtk.Label({
		        label: _(Constants.TRANSLATORS),
		        use_markup: true,
		        halign: Gtk.Align.START,
                hexpand: false,
                vexpand: false,
            });
            translatorsPage.append(creditsLabel);
            creditsLabel = new Gtk.Label({
		        label: _(Constants.CONTRIBUTORS),
		        use_markup: true,
		        halign: Gtk.Align.START,
                hexpand: false,
                vexpand: false,
            });
            contributorsPage.append(creditsLabel);
            creditsLabel = new Gtk.Label({
		        label: _(Constants.ARTWORK),
		        use_markup: true,
		        halign: Gtk.Align.START,
                hexpand: false,
                vexpand: false,
            });
            artworkPage.append(creditsLabel);
            arcMenuImageBox.append(arcMenuLabel);
            arcMenuImageBox.append(projectDescriptionLabel);
            arcMenuInfoBox.append(linksBox);

            let gnuSofwareLabel = new Gtk.Label({
                label: _(Constants.GNU_SOFTWARE),
                use_markup: true,
                justify: Gtk.Justification.CENTER
            });
            let gnuSofwareLabelBox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                valign: Gtk.Align.END,
                vexpand: true,
                margin_top: 5,
                margin_bottom: 10
            });
            gnuSofwareLabelBox.append(gnuSofwareLabel);

            this.mainBox.append(arcMenuImageBox);
            this.mainBox.append(arcMenuInfoBox);
            this.mainBox.append(extensionInfoFrame);

            this.mainBox.append(this.creditsScrollWindow)
            this.mainBox.append(gnuSofwareLabelBox);
        }
});

function createSeparator(){
    let separatorRow = new Gtk.ListBoxRow({
        selectable: false,
        activatable: false
    });
    separatorRow.set_child(Gtk.Separator.new(Gtk.Orientation.HORIZONTAL));
    return separatorRow;
}

var ArcMenuPreferencesWidget = GObject.registerClass(
class Arc_Menu_ArcMenuPreferencesWidget extends Gtk.Box{
    _init() {
        super._init({
            orientation: Gtk.Orientation.HORIZONTAL,
            width_request: 850,
            height_request: 650
        });

        this.leftHeaderBox = new Gtk.Box({
            hexpand: true,
            visible: true
        });

        this._settings = Convenience.getSettings(Me.metadata['settings-schema']);
        
        this.backButton = new Gtk.Button({
            child: new Gtk.Image({icon_name: 'go-previous-symbolic'}),
            visible: true
        });
        this.backButton.connect("clicked", () => {
            if(this.settingsListStack.get_visible_child() === this.settingsListStack.get_child_by_name('MenuSettingsShortcuts')){
                this.settingsListStack.set_visible_child_name("MenuSettings");
                this.settingsListStack.get_child_by_name('MenuSettings').listBox.selectFirstRow();
            }
            else{
                this.leftHeaderBox.remove(this.backButton);
                this.settingsListStack.set_visible_child_name("Main");
                this.settingsListStack.get_child_by_name('Main').listBox.selectFirstRow();
            }
        });

        this.settingsFrameStack = new Gtk.Stack({
            hhomogeneous: true,
            transition_type: Gtk.StackTransitionType.CROSSFADE
        });

        this.settingsListStack = new Gtk.Stack({
            hhomogeneous: true,
            transition_type: Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
        });

        let mainStackListBox = new PW.StackListBox(this, {width_request: 215});
        
        let mainStackBox = mainStackListBox.scrollWindow;
        mainStackListBox.addRow("General", _("General"), 'homescreen-symbolic');
        mainStackListBox.addRow("MenuLayout", _("Menu Layout"), 'menu-layouts-symbolic')
        mainStackListBox.addRow("MenuTheme", _("Menu Theme"), 'menu-theme-symbolic');
        mainStackListBox.addRow("MenuSettingsGeneral", _("Menu Settings"), 'menu-settings-symbolic', "MenuSettings");
        mainStackListBox.addRow("ButtonAppearance", _("Button Appearance"),  'arc-menu-symbolic')
        mainStackListBox.addRow("Misc", _("Misc"), 'misc-symbolic')
        mainStackListBox.addRow("About", _("About"), 'info-circle-symbolic');
        mainStackListBox.setSeparatorIndices([1, 4, 5]);

        let menuSettingsStackListBox = new PW.StackListBox(this, {width_request: 215});
        let menuSettingsListBox = menuSettingsStackListBox.scrollWindow;
        menuSettingsStackListBox.addRow("MenuSettingsGeneral", _("Menu Settings"), 'menu-settings-symbolic');
        menuSettingsStackListBox.addRow("MenuSettingsPinnedApps", _("Pinned Apps"), 'pinned-apps-symbolic');
        menuSettingsStackListBox.addRow("MenuSettingsShortcutDirectories", _("Shortcuts"), 'shortcuts-symbolic', 'MenuSettingsShortcuts');
        menuSettingsStackListBox.addRow("MenuSettingsCategories", _("Categories"), 'categories-symbolic');
        menuSettingsStackListBox.addRow("MenuSettingsFineTune", _("Fine-Tune"), 'fine-tune-symbolic');
        menuSettingsStackListBox.setSeparatorIndices([1, 4]);
 
        let menuSettingsShortcutsStackListBox = new PW.StackListBox(this, {width_request: 215});
        let menuSettingsShortcutsListBox = menuSettingsShortcutsStackListBox.scrollWindow;
        menuSettingsShortcutsStackListBox.addRow("MenuSettingsShortcutDirectories", _("Directories"), 'folder-documents-symbolic');
        menuSettingsShortcutsStackListBox.addRow("MenuSettingsShortcutApplications", _("Applications"), 'preferences-desktop-apps-symbolic');
        menuSettingsShortcutsStackListBox.addRow("MenuSettingsShortcutSessionButtons", _("Session Buttons"), 'gnome-power-manager-symbolic');
        menuSettingsShortcutsStackListBox.addRow("MenuSettingsShortcutExtras", _("Extra Shortcuts"), 'user-bookmarks-symbolic');
 
        this.settingsListStack.add_named(mainStackBox, "Main");
        this.settingsListStack.add_named(menuSettingsListBox, "MenuSettings");
        this.settingsListStack.add_named(menuSettingsShortcutsListBox, "MenuSettingsShortcuts");

        let sidebar = new Gtk.StackSidebar();
        sidebar.set_stack(this.settingsListStack);
        this.append(this.settingsListStack);
        this.append(sidebar);

        this.append(this.settingsFrameStack);
        this.populateSettingsFrameStack();
    }

    populateSettingsFrameStack(){
        this.settingsFrameStack.add_named(new GeneralPage(this._settings), "General");
        this.settingsFrameStack.add_named(new MenuLayoutPage(this._settings), "MenuLayout");
        this.settingsFrameStack.add_named(new MenuThemePage(this._settings), "MenuTheme");

        this.settingsFrameStack.add_named(new MenuSettingsGeneralPage(this._settings), "MenuSettingsGeneral");
        this.settingsFrameStack.add_named(new MenuSettingsPinnedAppsPage(this._settings), "MenuSettingsPinnedApps");

        let menuSettingsPinnedAppsPage = this.settingsFrameStack.get_child_by_name("MenuSettingsPinnedApps");

        if(this.pinnedAppsChangedID){
            this._settings.disconnect(this.pinnedAppsChangedID);
            this.pinnedAppsChangedID = null;
        }
        this.pinnedAppsChangedID = this._settings.connect("changed::pinned-app-list", () =>{
            menuSettingsPinnedAppsPage.frame.remove_all_children();
            menuSettingsPinnedAppsPage._loadPinnedApps(this._settings.get_strv('pinned-app-list'));
            menuSettingsPinnedAppsPage.frame.show();
        });
        
        this.settingsFrameStack.add_named(new MenuSettingsShortcutDirectoriesPage(this._settings), "MenuSettingsShortcutDirectories");
        this.settingsFrameStack.add_named(new MenuSettingsShortcutApplicationsPage(this._settings), "MenuSettingsShortcutApplications");
        this.settingsFrameStack.add_named(new MenuSettingsShortcutSessionButtonsPage(this._settings), "MenuSettingsShortcutSessionButtons");
        this.settingsFrameStack.add_named(new MenuSettingsShortcutExtrasPage(this._settings), "MenuSettingsShortcutExtras");  
        this.settingsFrameStack.add_named(new MenuSettingsCategoriesPage(this._settings), "MenuSettingsCategories");
        this.settingsFrameStack.add_named(new MenuSettingsFineTunePage(this._settings), "MenuSettingsFineTune");
        this.settingsFrameStack.add_named(new ButtonAppearancePage(this._settings), "ButtonAppearance");
        this.settingsFrameStack.add_named(new MiscPage(this._settings, this), "Misc");
        this.settingsFrameStack.add_named(new AboutPage(this._settings), "About");

        this.show();
        this.settingsListStack.set_visible_child_name("Main");
        this.settingsListStack.get_child_by_name('Main').listBox.selectFirstRow(); 
        if(this.backButton.get_parent()){
            this.leftHeaderBox.remove(this.backButton);
        }
    }

    modifyTitleBar(){
        GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            let window = this.get_root();
            window.set_title(_("ArcMenu Settings"));
            window.get_titlebar().pack_start(this.leftHeaderBox);
            return GLib.SOURCE_REMOVE;
        });
    }
});

function init() {
    Convenience.initTranslations(Me.metadata['gettext-domain']);
}

function buildPrefsWidget() {
    let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
    if(!iconTheme.get_search_path().includes(Me.path + "/media/icons/prefs_icons"))
        iconTheme.add_search_path(Me.path + "/media/icons/prefs_icons");
    let widget = new ArcMenuPreferencesWidget();
    widget.show();
    widget.modifyTitleBar();
    return widget;
}

function checkIfValidShortcut(frameRow, label, icon){
    if(frameRow._cmd.endsWith(".desktop") && !Gio.DesktopAppInfo.new(frameRow._cmd)){
        icon.icon_name = 'warning-symbolic';
        frameRow.tooltip_text = _("Error - Invalid Shortcut");
        label.label = "<b><i>" + _("Invalid Shortcut") + "</i></b> "+ _(label.label);
    } 
}

function getIconPath(listing){
    let path, icon;
        
    if(listing[2]=="ArcMenu_Home")
        path = GLib.get_home_dir();
    else if(listing[2].startsWith("ArcMenu_")){
        let string = listing[2];
        path = string.replace("ArcMenu_",'');
        if(path === "Documents")
            path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DOCUMENTS);
        else if(path === "Downloads")
            path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DOWNLOAD);
        else if(path === "Music")
            path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_MUSIC);
        else if(path === "Pictures")
            path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_PICTURES);
        else if(path === "Videos")
            path = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_VIDEOS);
        else
            path = null;
    }
    else if(listing[1] == listing[2])
        path = listing[2];
    else if(listing[1] == "ArcMenu_Folder"){
        path = listing[2];
    }
    else
        path = null;

    if(path){
        let file = Gio.File.new_for_path(path);
        try {
            let info = file.query_info('standard::symbolic-icon', 0, null);
            icon = info.get_symbolic_icon();
        } catch (e) {
            if (e instanceof Gio.IOErrorEnum) {
                if (!file.is_native()) {
                    icon = new Gio.ThemedIcon({ name: 'folder-remote-symbolic' });
                } else {
                    icon = new Gio.ThemedIcon({ name: 'folder-symbolic' });
                }
            }
        }                            
        return icon.to_string();
    }
    else{
        if(listing[2]=="ArcMenu_Network")
            return  'network-workgroup-symbolic';
        else if(listing[2]=="ArcMenu_Computer")
            return  'drive-harddisk-symbolic';
        else
            return listing[1];
    }
}
