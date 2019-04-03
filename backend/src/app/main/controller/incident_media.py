import json
import os
from os.path import join, dirname, realpath
from flask import Flask, jsonify

from flask import flash, request, redirect, url_for
from werkzeug.utils import secure_filename

from flask_restful import reqparse, abort, Api, Resource, request, fields, marshal_with

from ..service.incident_media import save_new_incident_media, get_all_incident_medias, get_a_incident_media, update_a_incident_media, delete_a_incident_media
from ...main import instancePath, rootPath, projectRoot
from .. import api

incident_media_fields = {
    
    'id' : fields.Integer,
    'file_name' : fields.String(1024),
    'url' : fields.String(1024),
    'incident_id' : fields.Integer,
    'user_id' : fields.Integer,
    'role_id' : fields.Integer,
    'is_active' : fields.Boolean,
    'created_date' : fields.DateTime,
    'updated_date' : fields.DateTime,
    'deleted_date' : fields.DateTime,
}

incident_media_list_fields = {
    'incident_medias': fields.List(fields.Nested(incident_media_fields))
}

@api.resource('/incident_medias')
class IncidentMediaList(Resource):
    @marshal_with(incident_media_fields)
    def get(self):
        """List all registered incident_medias"""
        return get_all_incident_medias()

    def post(self):
        """Creates a new IncidentMedia """
        data = request.get_json()
        return save_new_incident_media(data=data)


@api.resource('/incident_medias/<id>')
class IncidentMedia(Resource):
    @marshal_with(incident_media_fields)
    def get(self, id):
        """get a incident_media given its identifier"""
        incident_media = get_a_incident_media(id)
        if not incident_media:
            api.abort(404)
        else:
            return incident_media

    def put(self, id):
        """Update a given IncidentMedia """
        data = request.get_json()
        return update_a_incident_media(id=id, data=data)

    def delete(self, id):
        """Delete a given IncidentMedia """
        return delete_a_incident_media(id)



# file upload check

@api.resource('/uploads')
class FileTest(Resource):
    @marshal_with(incident_media_fields)
    def get(self):
        return "got! :p"

    def post(self):
        # check if the post request has the file part
        print("file uploads here!")
        if 'file' not in request.files:
            print (request.files)
            return "No file part"
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return "No selected file"
        if file:
            # UPLOADS_PATH = join(dirname(realpath(__file__)), 'files')
            UPLOADS_PATH = join(projectRoot(), 'media')
            filename = secure_filename(file.filename)
            # return filename
            file.save(os.path.join(UPLOADS_PATH, filename))
            return "File uploaded succesfully!"
                                
