Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

Router.route('/', {
    name : 'home'
});

Router.route('/user/my_profile', {
    name: 'userSelfProfile'
});

Router.route('/work_in_progress', {
    name: 'workInProgress'
});

var requireLogin = function() {
    if (! Meteor.user()) {
        this.render('accessDenied');
    } else {
        this.next();
    }
}
Router.onBeforeAction(requireLogin, {only: 'userSelfProfile'});