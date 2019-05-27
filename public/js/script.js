
(function() {

    Vue.component('image-modal', {
        template: "#image-template",
        //template: = define the HTML for the modal in
                    //the HTML file and taregt the ID given.
        props: ['name', 'imageClicked'],
        //props = allow to accsses to the DATA of the "new Vue"
        //        what we pass to props is the property DATA
        //        that we want to accsses.
        data: function() {
            //data = we write data as a function
            //      because we want it to return an object.
            //      it handels the data same as in 'new Vue'!
            return {
                imagePopUp: [],
                comment: [],
                addComment: {
                    username: "",
                    comment: "",
                    id: this.imageClicked
                }
            }//returnData close.
        },//Data close
        mounted: function () {
            console.log('this is mounted of Vue component:', this);
        //we can do the axios.get in 2 ways:
        //#1:
        var self = this;
            axios.get('/get-image-info/' + this.imageClicked)
                .then(function(resp) {
                    self.imagePopUp = resp.data;
                    //console.log('self.imagePopUp:', self.imagePopUp);
                });
        //  #2:
        //  axios.get('/get-image-info', {
        //      imageClicked: this.imageClicked
        // })
        },//mounted close
        methods: {
            close: function() {
                //console.log('we are closing the image:');
                this.$emit("closeimage");
            },//close closes.

            uploadComment: function(e) {
                e.preventDefault();
                //console.log('uploadFile running!');

                var formData = new FormData();
                formData.append('username', this.addComment.username);
                formData.append('comment', this.addComment.comment);
                //console.log('this is formData comment', this.addComment.comment);

                var self = this;
                axios.post('/addComment', this.addComment)
                     .then(function(resp){
                         console.log('this is resp of addcomment POST:', resp);
                         self.comment.unshift(resp.data);
                        console.log('resp in POST/addComment', self.comment);
                     }).catch(function (err) {
                         console.log("error in axios POST Upload:", err);
                     });//catch close.
            }//uploadComment close.
        }//methods close.
    });//Vue component close.

    var vm = new Vue({
        el: '#main',
        data: {
            imageClicked: '',
            name: 'omer',
            imageboard: [],
            form: {
                title: '',
                description:'',
                username: '',
                file: null
             }//,FORM closes
        },//DATA close

        mounted: function() {
            var self = this;
            axios.get('/imageboard').then(function(resp) {
                    self.imageboard = resp.data;
                    //console.log('self.imageboard:', self.imageboard);
            });
        }, //mounted close

        methods: {
            closemodal : function () {
                this.imageClicked = null
            },//closemodal close.

            toggleimageModal: function(image) {
                console.log('image:', image);
                this.imageClicked = image;
                //console.log('this is Vue INSTANCE:', this);
            },//toggleimageModal close.

            handleFileChange: function(e) {
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

                var self = this;
                axios.post('/upload', formData)
                     .then(function(resp) {
                         //console.log('resp in POST/upload', resp.data);
                         self.imageboard.unshift({
                            id: resp.data.id,
                            url: resp.data.url,
                            description: resp.data.description,
                            title: resp.data.title,
                            username: resp.data.username
                        });
                     }).catch(function (err) {
                         console.log("error in axios POST Upload:", err);
                     });//catch close.
            }//uploadFile close.
        }//methods close.
    })//Vue instance close.
}());
