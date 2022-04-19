/** Cupcake List
 * 
 * CupcakeList is an object that generates/updates the hmtl list of cupcakes from the cupcakes db. It will use axios to make requests to our flask api and update the index.html page acordingly
 * 
 */

class CupcakeList {
    constructor() {
        this.cupcakes = new Array;
        this.generateHtmlList();
    }

    /** generateHtmlList: create list of cupcakes retrieved from cupcakes api 
     * 
     *  each cupcake gets a bootstrap card to display all information + img and
     *  is appended to the #cupcake_list
    */

    async generateHtmlList() {
        const cc_list = await this.get_all_cupcakes();
        const $cc_html_list = $("#cupcake_list");
        $cc_html_list.empty();

        for (let cc of cc_list) {
            //create <li> for each cc and append <div> card
            let $cc_li = $("<li>");
            let $cc_div_card = $('<div>');
            $cc_div_card.addClass('card');
            $cc_li.append($cc_div_card);

            // create img for div card and append it
            let $cc_img = $("<img>").addClass('card-img-top').attr('style', 'height: 300px;').attr('src', `${cc.image}`)
            $cc_div_card.append($cc_img);

            // create div card body + text
            let $cc_body = $('<div>').addClass('card-body');
            let $cc_flavor = $('<h5>').addClass('card-title').text(`Flavor: ${cc.flavor}`);
            let $cc_size = $('<p>').addClass('card-text').text(`Size: ${cc.size}`);
            let $cc_rating = $('<p>').addClass('card-text').text(`Rating: ${cc.rating}`);

            // append text to body, append body to card
            $cc_body.append($cc_flavor, $cc_size, $cc_rating);
            $cc_div_card.append($cc_body);

            //append the comleted div card within an li to cupcake_list
            $cc_html_list.append($cc_li);
        }
        // Add event listener for form submission
        this.handleFormSubmit = this.handleSubmit.bind(this);
        $('#cupcake_form').on('submit', this.handleFormSubmit);
    }

    // makes a request to api to get all cupcakes in db
    async get_all_cupcakes() {
        let resp = await axios.get('/api/cupcakes');
        return resp.data.cupcakes;
    }

    // stops page from refreshing, captures form values, makes a post request to api to add new cupcake to db, refreshes list html and clears form values.
    async handleSubmit(evt) {
        evt.preventDefault();
        // Capture form values into variables
        const new_cc = this.capture_form_values();
        let resp = await this.post_new_cupcake(new_cc);
        // On successful submission of cupcake to api, append new_cc to cupcake_list and clear the form.
        if (typeof (resp) !== String) {
            this.generateHtmlList();
            this.clear_form_values();
        }
        else {
            alert("Form submission unsuccessful");
        }


    }

    capture_form_values() {
        let flavor = $('#cc_flavor').val();
        let size = $('#cc_size').val();
        let rating = $('#cc_rating').val();
        let image = $('#cc_image').val();
        return { "flavor": flavor, "size": size, "rating": rating, "image": image }
    }

    clear_form_values() {
        $('#cc_flavor').val("");
        $('#cc_size').val("");
        $('#cc_rating').val("");
        $('#cc_image').val("");
    }

    async post_new_cupcake(cupcake) {
        axios.post('/api/cupcakes', cupcake).then((resp) => {
            console.log(resp.data);
            return resp.data;
        }).catch((error) => {
            console.log('There was an error: ' + error);
            return "There was an error: " + error;
        });
    }

    append_new_cupcake(cupcake) {

    }

}

new CupcakeList();