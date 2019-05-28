
(function() {

    Vue.component('image-modal', {
        template: "#image-template",
        props: [ 'imageClicked' ],
        data: function() {
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
        var self = this;
            axios.get('/get-image-info/' + this.imageClicked)
                .then(function(resp) {
                    console.log('this is get image info resp:', resp);
                    self.imagePopUp = resp.data[0];
                    self.comment = resp.data[1];
                    console.log('resp.data[1][0]:', resp.data[1]);
                });
        },//mounted close
        methods: {
            close: function() {
                this.$emit("closeimage");
                location.hash = "";
            },//close closes.

            uploadComment: function(e) {
                e.preventDefault();
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
        },//methods close.
        watch: {
           imageClicked: function() {
               console.log('I watch imageClicked in watch');
               var self = this;
                   axios.get('/get-image-info/' + this.imageClicked)
                       .then(function(resp) {
                           self.imagePopUp = resp.data[0];
                           self.comment = resp.data[1];
                       });
           }//watch/imageClicked closes.
       }//watch close.
    });//Vue component close.

    var vm = new Vue({
        el: '#main',
        data: {
            imageClicked: location.hash.slice(1),
            name: 'omer',
            imageboard: [],
            getMore: false,
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
                        if (
                            self.imageboard[self.imageboard.length - 1].id !=
                            self.imageboard[self.imageboard.length - 1].lowest_id
                        ) {
                            self.getMore = true;
                        }
            });//axios.get('/imageboard') close.
            addEventListener('hashchange', function() {
                console.log('hash is active ');
                self.imageClicked = location.hash.slice(1);
                console.log('hash was changed to ', self.imageClicked);
            });//addEventListener close.
        }, //mounted close

        methods: {
            closemodal : function () {
                this.imageClicked = null
            },//closemodal close.

            toggleimageModal: function(image) {
                console.log('image:', image);
                this.imageClicked = image;
                location.hash = '';
                //console.log('this is Vue INSTANCE:', this);
            },//toggleimageModal close.
            getMoreImages: function() {
                  var self = this;
                  let lastImage = this.imageboard[this.imageboard.length - 1].id;
                  axios.get("/more-images/" + lastImage).then(function(resp) {
                      self.imageboard = self.imageboard.concat(resp.data);
                          if (
                              self.imageboard[self.imageboard.length - 1].id ===
                              self.imageboard[self.imageboard.length - 1].lowest_id
                          ) {
                              self.getMoreButton = false;
                          }
                  });
            },//getMoreImages close.
            handleFileChange: function(e) {
                this.form.file = e.target.files[0]
            },//handleFileChange closes

            uploadFile: function(e) {
                e.preventDefault();
                var formData = new FormData();

                formData.append('file', this.form.file);
                formData.append('title', this.form.title);
                formData.append('username', this.form.username);
                formData.append('description', this.form.description);

                var self = this;
                axios.post('/upload', formData)
                     .then(function(resp) {
                         self.imageboard.unshift({
                            id: resp.data.id,
                            url: resp.data.url,
                            description: resp.data.description,
                            title: resp.data.title,
                            username: resp.data.username,
                        });
                     }).catch(function (err) {
                         console.log("error in axios POST Upload:", err);
                     });//catch close.
            }//uploadFile close.
        }//methods close.
    })//Vue instance close.
}());
