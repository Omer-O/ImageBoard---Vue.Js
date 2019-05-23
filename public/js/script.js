
(function() {

    new Vue({
        el: '#main',
        data: {
            name: 'omer',
            imageboard: [],
            form: {
                title: '',
                //v-model='form.ytheNmaeOfTheField' = in the HTML
                //will bound the html and
                //the js - all the data the user will type
                //automaticly end up here in the data/
                description:'',
                username: '',
                file: null
            }//FORM closes
        },//DATA close

        mounted: function() {
            var self = this;
            axios.get('/imageboard').then(function(resp) {
                    self.imageboard = resp.data;
                    console.log('self.imageboard:', self.imageboard);
            });
        }, //mounted close

        methods: {
            //here we will write all the event listen functions!!!
            handleFileChange: function(e) {
                console.log('handleFileChange e', e.target.files[0]);
                //e.target.files[0] = will give us the exact file was uploaded
                console.log('this:', this);
                this.form.file = e.target.files[0]
                // the left side axcess the date = the right side
                //reassign/UPLOADing the data and storing it in data
                //this = reffer to the VUE instence!!! every property
                //we will put on data will be 'inside it'
            },//handleFileChange closes

            uploadFile: function() {
                //console.log('uploadFile running!');
                //will show us the event on submit button.
                var formData = new FormData();
                //FormData = API to handle files
                //files are 'special' we have to use API.
                formData.append('file', this.form.file);
                formData.append('title', this.form.title);
                formData.append('username', this.form.username);
                formData.append('description', this.form.description);
                // .append() = allow us to add only! to FormData.
                // append takes 2 paramenters - input name, and the data!
                console.log('formData:', formData);
                // formData will be empty !BUT IT IS OK!
                axios.post('/upload', formData)
                     .then(function(resp) {
                         console.log('resp in POST/upload', resp);
                     });
            }//uploadFile close.
        }//methods close.
    })//close Vue instance.
}());
