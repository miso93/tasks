/**
 * Created by Michal on 10.10.2016.
 */


Pusher.logToConsole = true;

var pusher = new Pusher(getPusherKey(), {
    cluster: 'eu',
    encrypted: true
});

Vue.component('tasks', {
    template: '#tasks-template',
    props: ['list'],
    data: function () {
        return {
            list: [],
            newTask: ''
        };
    },
    created: function () {
        this.fetchTaskList();
    },
    computed: {
        doneTasksList: function () {
            return this.list.filter(this.isDone);
        },
        openTasksList: function (){
            return this.list.filter(this.isOpen);
        }
    },
    methods: {
        isDone : function(task){
            return task.done;
        },
        isOpen: function(task){
            return !this.isDone(task);
        },
        doneTask: function(task){
          task.done = 1;
            this.editTask(task);
        },
        upPriority: function (task) {
            task.priority += 1;
            this.editTask(task);
        },
        downPriority: function (task) {
            task.priority -= 1;
            this.editTask(task);
        },
        backOpen: function (task) {
            task.done = 0;
            this.editTask(task);
        },
        editTask: function (task) {
            var resource = this.$resource('api/tasks{/id}');

            resource.update({id: task.id}, task).then(function (response) {

            });
        }
        ,
        fetchTaskList: function () {
            var vm = this;
            var resource = this.$resource('api/tasks{/id}');

            resource.get().then(function (response) {
                vm.list = response.body;
            });
        }
        ,
        deleteTask: function (task) {
            var resource = this.$resource('api/tasks{/id}');

            resource.delete({id: task.id}).then(function (response) {

            });

            // this.list.$remove(task);
        }
        ,
        createTask: function () {
            var resource = this.$resource('api/tasks{/id}');
            var vm = this;
            resource.save({body: this.newTask}).then(function (response) {
                // vm.list.push(response.body);
                this.newTask = '';
            });

        }
    }
    ,
    ready: function () {
        var vm = this;
        var channel = pusher.subscribe('tasks');

        channel.bind('new-task', function (data) {
            vm.list.push(data);
        });

        channel.bind('edit-task', function (data) {
            vm.list = vm.list.filter(function (value) {
                return data.id != value.id;
            });
            vm.list.push(data);
        });

        channel.bind('delete-task', function (data) {
            // console.log('data id', data.id);
            vm.list = vm.list.filter(function (value) {
                return data.id != value.id;
            });
        });
    }
})
;

new Vue({
    el: 'body'
});