from remark.geo.models import ZipcodePolygon

def fetch_zip_polygons(zip_code):
    try:
        row = ZipcodePolygon.objects.get(zip_code=zip_code)
        return row.geometry
    except ZipcodePolygon.DoesNotExist:
        return None
