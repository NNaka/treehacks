#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pebble.h>
//#include "pebble_health.h"

static void health_handler(HealthEventType event, void *context) {
    // Which type of event occured?
    switch(event) {
        case HealthEventSignificantUpdate:
            APP_LOG(APP_LOG_LEVEL_INFO, 
                    "New HealthService HealthEventSignificantUpdate event");
            break;
        case HealthEventMovementUpdate:
            APP_LOG(APP_LOG_LEVEL_INFO, 
                    "New HealthService HealthEventMovementUpdate event");
            break;
        case HealthEventSleepUpdate:
            APP_LOG(APP_LOG_LEVEL_INFO, 
                    "New HealthService HealthEventSleepUpdate event");
            break;
    }
}

static int get_steps() {
#if defined(PBL_HEALTH)
    // Use the step count metric
    HealthMetric metric = HealthMetricStepCount;

    // Create timestamps for midnight (the start time) and now (the end time)
    time_t start = time_start_of_today();
    time_t end = time(NULL);

    // Check step data is available
    HealthServiceAccessibilityMask mask = health_service_metric_accessible(metric, 
            start, end);
    bool any_data_available = mask & HealthServiceAccessibilityMaskAvailable;
#else
    // Health data is not available here
    bool any_data_available = false;
#endif
}

int main() {
    return 0;
}

