Template.layout.helpers({
    //add you helpers here
    contextualData: function () {

        let currentRouteArray = document.location.href.split("/");
        let contextualData = {}
        arborescenceStructure().forEach(function (item) {
            if (currentRouteArray[3] === item.id) {
                contextualData = item
            }
        })
        if (contextualData.id = "project") {
            Meteor.call('projectToolbarData', currentRouteArray[4], function (error, result) {
                if (!error) {
                    dump(result)

                    return result
                }
            })
        } else {
            return {}
        }
    },
    openConversationPannel : function () {
        let valeur_clientWidth = document.body.clientWidth
        if(!Meteor.Device.isPhone() &&(valeur_clientWidth >1284 || valeur_clientWidth >601)){
            return Session.get('openConversationPannel')
        }
    }
});

Template.layout.events({
    //add your events here
});

Template.layout.onCreated(function () {
    if (Meteor.userId()) {
        Tracker.autorun(() => {
            if (!Session.get("AsymPrivateKey")) {
                Meteor.setTimeout(() => {
                    if (!Session.get("AsymPrivateKey")) {
                        Meteor.logout()
                    }
                }, 100)
            }
        })


    }
});

Template.layout.onRendered(function () {
    //add your statement here
});

Template.layout.onDestroyed(function () {
    //add your statement here
});

