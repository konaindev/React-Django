from airflow.models import BaseOperator
from datetime import datetime, timedelta, date
import os
from google.cloud import firestore, storage, exceptions
import logging
from typing import Optional, List

class GoogleDatastoreOperator(BaseOperator):
    def __init__(self, collection, view_id, sub_collection: Optional[List]=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.view_id = view_id
        self.collection = collection
        self.sub_collection = sub_collection or []


    def execute(self, context):
        logging.info("Add Data to Google Datastore")

        db = firestore.Client()
        doc_ref = db.collection(self.collection["collection"]).document(self.collection["document"])
        for sub in self.sub_collection:
            doc_ref = doc_ref.collection(sub["collection"]).document(sub["document"])

        doc_ref.set({
            u'first': u'Ada',
            u'last': u'Lovelace',
            u'born': 1815
        })

        logging.info("Datastore updated")
