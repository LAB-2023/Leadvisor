// app/java/com.nativemoduleworkshop/ToastModule.java

package com.yourguide;

import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;



import java.util.HashMap;
import java.util.Map;

public class SelfmadeLocationModule extends ReactContextBaseJavaModule {

    private Context mContext;
    private Intent mForegroundServiceIntent;
    private static final String CONST_JS_LOCATION_EVENT_NAME = "JS_LOCATION_EVENT_NAME";
    private static final String CONST_JS_LOCATION_LAT = "JS_LOCATION_LAT_KEY";
    private static final String CONST_JS_LOCATION_LON = "JS_LOCATION_LON_KEY";
    private static final String CONST_JS_LOCATION_TIME = "JS_LOCATION_TIME_KEY";

    SelfmadeLocationModule(ReactApplicationContext context) {
        super(context);
        mContext = context;
        mForegroundServiceIntent = new Intent(mContext, LocationService.class);
    }

    @Override
    public String getName(){
        return "LocationModule";
    }

    @ReactMethod
    public void startBackgroundLocation() {
        ContextCompat.startForegroundService(mContext, mForegroundServiceIntent);
        android.widget.Toast.makeText(mContext, "백그라운드 gps 실행 시작", Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void stopBackgroundLocation() {
        mContext.stopService(mForegroundServiceIntent);
        android.widget.Toast.makeText(mContext, "백그라운드 gps 실행 중지", Toast.LENGTH_SHORT).show();
    }


    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
//        constants.put(CONST_JS_LOCATION_EVENT_NAME, LocationForegroundService.JS_LOCATION_EVENT_NAME);
//        constants.put(CONST_JS_LOCATION_LAT, LocationForegroundService.JS_LOCATION_LAT_KEY);
//        constants.put(CONST_JS_LOCATION_LON, LocationForegroundService.JS_LOCATION_LON_KEY);
//        constants.put(CONST_JS_LOCATION_TIME, LocationForegroundService.JS_LOCATION_TIME_KEY);
        return constants;
    }

}