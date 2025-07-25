const ContactService = require("../services/contact.service");
const MongoDb = require("../utils/mongodb.util");

exports.create = async (req, res) => {
    
    if (!req.body.name) {
        return next(new ApiError(400, 'Name can not be empty'));
    }

    try {
        const contactService = new ContactService(MongoDb.client);
        const document = await contactService.create(req.body);
        res.send(document);
    } catch(error) {
        console.error("Error creating contact:", error);
        return next(new ApiError(500, `An error occurred while creating the contact`));
    }
}

exports.findAll = async (req, res, next) => {
    let documents =[]
    try {
        const contactService = new ContactService(MongoDb.client);
        const {name} = req.query; 
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find();
        }
    }
    catch(error){

        return next(new ApiError(500, `An error occurred while retrieving contacts`));
    }

    return res.send(documents);
}

exports.findOne = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDb.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        res.send(document);
    } catch(error) {
        return next(new ApiError(500, `Error retrieving contact with id=${req.params.id}`));
    }


}

exports.update = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try {
        const contactService = new ContactService(MongoDb.client);
        const document = contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'Contact not found'));
        }   

        res.send({message: "Contact was updated successfully"});
    } catch (error){
        return next(new ApiError(500, `Error updating contact with id=${req.params.id}`));
    }
}

exports.delete = async (req, res, next) => {
    try {
        console.log("delete handler");
        const contactService = new ContactService(MongoDb.client);
        const result = await contactService.delete(req.params.id);
        if (!result) {
            return next(new ApiError(404, 'Contact not found'));
        }
        res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        console.error("Error deleting contact:", error);
        return next(new ApiError(500, `Could not delete contact with id=${req.params.id}`));
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDb.client);
        const result = await contactService.deleteAll();
        res.send({message: `${result.deletedCount} contacts were deleted successfully`});
    } catch (error){
        return next(new ApiError(500, 'An error occurred while removing all contacts'));
    }
}

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDb.client);
        const documents = await contactService.findFavorite();
        res.send(documents);
    } catch(error){
        return next(new ApiError(500, 'An error occurred while retrieving favorite contacts'));
    }
}