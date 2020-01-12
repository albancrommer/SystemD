import projectController from "../../../../../lib/controllers/projectController";
import Spreadsheet from "../../../../../../imports/classes/Spreadsheet";
import cryptoTools from "../../../../../lib/cryptoTools";

Template.spreadsheetList.helpers({
    //add you helpers here
    isEditing: function () {

        return Template.instance().isEditing.get()
    },
    showDelete: function () {
        return Template.instance().showDelete.get()
    },
    showNewSpreadsheet: function () {
        return Template.instance().showNewSpreadsheet.get()
    },

    spreadsheets: function () {
        return Template.instance().spreadsheets.get()
    },
    hasMore: function () {
        return Template.instance().spreadsheetsLimit.get() < Template.currentData().currentProject.private.spreadsheetCount
    },
    isCurrentCategory: function () {
        FlowRouter.watchPathChange()
        return FlowRouter.current().queryParams.spreadsheetId
    },
    isLoading: function () {
        return Template.instance().isLoading.get()
    },
    isCreating: function () {
        return Template.instance().isCreating.get()
    }
});

Template.spreadsheetList.events({
    //add your events here
    'click [openSettings]': function (event) {
        event.stopPropagation()
    },

    "click [openNewSpreadsheet]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        $('.tooltipped').tooltip('remove')
        Meteor.setTimeout(() => {
            $('#newSpreadsheetName').focus()
            resetTooltips()
        }, 400)
        instance.showNewSpreadsheet.set(true)
    },
    "submit [newSpreadsheetForm]": function (event, instance) {
        event.preventDefault()
        event.stopPropagation()
        instance.isCreating.set(true)
        $('.tooltipped').tooltip('remove')
        let currentProjectId = instance.data.currentProject._id
        let spreadsheetParmas = {
            projectId: currentProjectId,
            symEnc_name: event.target.newSpreadsheetName.value,
        }
        cryptoTools.encryptObject(spreadsheetParmas, {symKey: Session.get("currentProjectSimKey")}, (encryptedSpreadsheetParams) => {
            let spreadsheet = new Spreadsheet()
            spreadsheet.callMethod('newSpreadsheet', projectController.getAuthInfo(currentProjectId), encryptedSpreadsheetParams, (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.warn(err)
                } else {
                    Meteor.setTimeout(() => {
                        resetTooltips()
                    }, 200)
                    instance.showNewSpreadsheet.set(false)
                    instance.isCreating.set(false)
                    console.log(res)
                    FlowRouter.go('/project/' + currentProjectId + '/forum/?spreadsheetId=' + res)
                }
            })
        })
    },
    'click [showMore]': function (event, instance) {
        event.preventDefault()
        instance.spreadsheetsLimit.set(instance.spreadsheetsLimit.get() + 5)
    }
});

Template.spreadsheetList.onCreated(function () {
    //add your statement here
    this.isEditing = new ReactiveVar(false)
    this.showDelete = new ReactiveVar(false)
    this.showNewSpreadsheet = new ReactiveVar(false)
    this.spreadsheets = new ReactiveVar([])
    this.isLoading = new ReactiveVar(true)
    this.isCreating = new ReactiveVar(false)
    this.spreadsheetsLimit = new ReactiveVar(5)

    this.autorun(() => {
        Meteor.subscribe('spreadsheets',
            projectController.getAuthInfo(this.data.currentProject._id),
            this.data.currentProject._id,
            this.spreadsheetsLimit.get(),
            err => {
                if (err) {
                    console.log(err)
                } else {
                    this.autorun(() => {
                        let encryptedSpreadsheets = Spreadsheet.find({}, {
                            sort: {
                                lastActivity: -1
                            }
                        }).fetch()
                        this.isLoading.set(false)
                        if (encryptedSpreadsheets.length) {
                            cryptoTools.decryptArrayOfObject(encryptedSpreadsheets, {symKey: Session.get('currentProjectSimKey')}, (spreadsheets) => {
                                this.spreadsheets.set(spreadsheets)
                            })
                        }else{
                            this.spreadsheets.set([])
                        }
                    })

                }
            })
    })
});

Template.spreadsheetList.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.spreadsheetList.onDestroyed(function () {
    //add your statement here
});

