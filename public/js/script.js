
(function() {

    Vue.component('image-modal', {
    //#2
    //define the HTML for the modal in the HTML file.
    //and then to tell the component where to find
    //the html
    template: "#image-template",
    props: ['name', 'imageClicked'],
    //props = allow to accsses to the DATA of the "new Vue"
    //        what we pass to props is the property DATA
    //         that we want to accsses.
    data: function() {
        //data = we write data as a function
        //      because we want it to return an object.
        //      it handels the data same as in 'new Vue'!
        return {
            imageName: 'Buna'
            //Render = it we do the same as
            //      "new Vue" {{ }} but INSIDE THE SCRIPT
            //      of component in the HTML
        }
    },//Data close
    mounted: function () {
        console.log('this is mounted of Vue component:', this);
        //we can do the axios.get in 2 ways:
    //  #1:
    //     axios.get('/get-image-info', {
    //     imageClicked: this.imageClicked
    // }) //axios.get close
    //  #2:
        axios.get('/get-image-info/' + this.imageClicked);
    }//mounted close
});// Vue component close

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
            toggleimageModal: function(image) {
                //#1 TRUE/FALSE
                //this.conditionForModal = true;
                    //here we put the opposite - so when we CLICK
                    //the condition will set to true/false - depands
                    //what we declaired in the view INSTANCE!

                //#2 Target the animal clicked and store it:
                console.log('image:', image);
                    //target the animalWasClicked in the Vue INSTANCE data
                    //animal reffers to the animal that the user clicked.
                this.imageClicked = image;
                console.log('this is Vue INSTANCE:', this);
            },//toggleAnimalModal close.
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

                var self = this;
                axios.post('/upload', formData)
                     .then(function(resp) {
                         console.log('resp in POST/upload', resp.data);
                         self.imageboard.unshift({
                             id: resp.data.id,
                            url: resp.data.url,
                            description: resp.data.description,
                            title: resp.data.title,
                            username: resp.data.username
                        });console.log('this is resp.data of post', resp.data);
                     }).catch(function (err) {
                         console.log("error in axios POST Upload:", err);
                     });//catch close.
            }//uploadFile close.
        }//methods close.
    })//Vue instance close.
}());
