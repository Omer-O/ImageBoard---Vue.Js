
(function() {

    new Vue({
        el: '#main',
        data: {
            name: 'omer',
            imageboard: [],
            form: {
                title: '',
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
            handleFileChange: function(e) {
                    // console.log('handleFileChange e', e.target.files[0]);
                    // console.log('this:', this);
                this.form.file = e.target.files[0]
            },//handleFileChange closes

            uploadFile: function(e) {
                e.preventDefault();
                    //console.log('uploadFile running!');
                var formData = new FormData();

                formData.append('file', this.form.file);
                formData.append('title', this.form.title);
                formData.append('username', this.form.username);
                formData.append('description', this.form.description);
                    //console.log('formData:', formData);

                axios.post('/upload', formData)
                     .then(function(resp) {
                         //console.log('resp in POST/upload', resp.data);
                         var self = this;
                         self.imageboard.unshift(resp.data);
                     }).catch(function (err) {
                         console.log("error in axios POST Upload:", err);
                     });//catch close.
            }//uploadFile close.
        }//methods close.
    })//Vue instance close.
}());
