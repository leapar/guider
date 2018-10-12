package com.newugo.guider.app;

//import org.lantern.mobilesdk.Lantern;
import android.app.Application;
import android.util.Log;

import com.newugo.guider.BuildConfig;

import im.fir.sdk.FIR;

/**
 * Created by wangxh on 2016/5/14.
 */
public class GuiderApplication extends Application  {
    @Override
    public void onCreate() {
        super.onCreate();
        FIR.init(this);
        boolean asService = false; // up to you

        // enable Lantern
        int startupTimeoutMillis = 30000;

        // Optional Google Analytics tracking ID that gives Team Lantern
        // feedback on your app's usage of Lantern.
        String trackingId = "UA-...";
        try {
        if (asService) {
         //   Lantern.enableAsService(getApplicationContext(), startupTimeoutMillis, null);
        } else {
            if(!BuildConfig.DEBUG) {
              //Lantern.enable(getApplicationContext(), startupTimeoutMillis, null);
            }
        }


        } catch (Exception e) {
            Log.d("APP", "Unable to start Lantern: " + e.getMessage());
        }
    }
}
