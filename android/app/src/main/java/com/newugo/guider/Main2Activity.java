package com.newugo.guider;

import android.app.Activity;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.leapar.model.DomItem;
import com.leapar.model.ListItem;
import com.leapar.module.ParserHtmlModule;
import com.microsoft.codepush.react.CodePush;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import cn.jpush.android.api.JPushInterface;

//import com.AirMaps.AirPackage;
//import com.baidu.mapapi.SDKInitializer;
//import com.AirMaps.AirPackage;
//import com.brentvatne.react.ReactVideoPackage;
//import com.applicaster.RNYouTubePlayer.YoutubePlayerReactPackage;

public class Main2Activity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "guider";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
          new CodePush("iiS218C1ap4JcDGZq50CDLpvhL3t4k0odtuCe", this, BuildConfig.DEBUG)/*,
                new VectorIconsPackage(),
                new JPushPackage(),

                new RealmReactPackage(),
                new RNSendIntentPackage(),
                new VitamioViewPackage(this),
               // new AirPackage(this),
                new ParserHtmlPackage()//,
              //  new ReactVideoPackage(),
              //  new YoutubePlayerReactPackage()*/
        );
    }

    // 2. Override the getJSBundleFile method in order to let
    // the CodePush runtime determine where to get the JS
    // bundle location from on each app start
    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //初始化百度地图
       // SDKInitializer.initialize(getApplicationContext());
        super.onCreate(savedInstanceState);


        new Thread(new Runnable() {
            @Override
            public void run() {
                Document doc;
                try {
                    doc = Jsoup.connect("http://www.kedou.share.video.zipaicao.com/videos/32936/c79c6a30262a0a928b93c868791249ed/").get();
                    String json = "{\n" +
                            "    tag: 'div.item',\n" +
                            "    item: [\n" +
                            "      {\n" +
                            "        tag: 'a',\n" +
                            "        func: 'attr',\n" +
                            "        arg: 'href'\n" +
                            "      },\n" +
                            "      {\n" +
                            "        tag: 'img.thumb',\n" +
                            "        func: 'attr',\n" +
                            "        arg: 'src'\n" +
                            "      },\n" +
                            "      {\n" +
                            "        tag: 'div.duration',\n" +
                            "        func: 'text'\n" +
                            "      },\n" +
                            "      {\n" +
                            "        tag: 'div.rating',\n" +
                            "        func: 'text'\n" +
                            "      },\n" +
                            "      {\n" +
                            "        tag: 'strong.title',\n" +
                            "        func: 'text'\n" +
                            "      }\n" +
                            "    ]\n" +
                            "  }";
                    Type type = new TypeToken<ListItem<ArrayList<DomItem>>>(){}.getType();
                    ListItem<ArrayList<DomItem>> listItem = new Gson().fromJson(json, type);
                    Elements listDiv = doc.select(listItem.tag);


                    JSONArray batchResults = new JSONArray();
                    for (int i = 0; i < listDiv.size(); i++) {
                        Element elm = listDiv.get(i);
                        JSONObject item = new JSONObject();
                        for(int j = 0; j < listItem.item.size();j++) {
                            String eleData = ParserHtmlModule.getElmData(elm, listItem.item.get(j));
                            item.put(j+"", eleData);
                        }
                        batchResults.put(item);
                    }

                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }).start();


    }

    @Override
    protected void onPause() {
        JPushInterface.onPause(this);
        super.onPause();
    }


    @Override
    protected void onResume() {
        JPushInterface.onResume(this);
        super.onResume();
    }
}
