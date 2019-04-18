from remark.geo.models import ZipcodePolygon

def fetch_zip_polygons(zip_code):
    try:
        row = ZipcodePolygon.objects.get(zip_code=zip_code)
    except ZipcodePolygon.DoesNotExist:
        row = None

    if row is not None:
        return row.geometry
    else:
        return None
