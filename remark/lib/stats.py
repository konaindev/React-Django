def health_check(stat, stat_target):
    # 0.50 = 750 / 1500
    percent = float(stat) / float(stat_target)
    if percent > 0.95:
        return 2
    elif percent > 0.75:
        return 1
    else:
        return 0
