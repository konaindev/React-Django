def to_percentage(value):
    percentage = value * 100
    return f"{percentage:.0f}%"


def health_status_to_str(health_status):
    statuses = {-1: "Campaign Pending", 0: "Off Track", 1: "At Risk", 2: "On Track"}
    return statuses[health_status]
