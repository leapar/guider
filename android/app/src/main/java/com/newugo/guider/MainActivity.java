package com.newugo.guider;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.github.yamill.orientation.OrientationPackage;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.leapar.model.DomItem;
import com.leapar.model.ListItem;
import com.leapar.module.ParserHtmlModule;
import com.leapar.module.ParserHtmlPackage;
import com.oblador.vectoricons.VectorIconsPackage;
//import com.AirMaps.AirPackage;

import cn.jpush.android.api.JPushInterface;
import cn.reactnative.modules.jpush.JPushPackage;

import com.microsoft.codepush.react.CodePush;

import io.realm.react.RealmReactPackage;
import io.vov.vitamio.activity.VideoViewBuffer;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.prefs.Preferences;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.newugo.guider.R;
import com.microsoft.codepush.react.CodePush;
//import com.baidu.mapapi.SDKInitializer;
//import com.AirMaps.AirPackage;
import com.RNVitamioView.VitamioViewPackage;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
//import com.brentvatne.react.ReactVideoPackage;
//import com.applicaster.RNYouTubePlayer.YoutubePlayerReactPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.eguma.barcodescanner.BarcodeScannerPackage;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

public class MainActivity extends ReactActivity {

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
      new OrientationPackage(this),
      new VectorIconsPackage(),
      new JPushPackage(),
      new CodePush("iiS218C1ap4JcDGZq50CDLpvhL3t4k0odtuCe", this, BuildConfig.DEBUG),
      new RealmReactPackage(),
      new RNSendIntentPackage(),
      new WebViewBridgePackage(),
      new VitamioViewPackage(this),
      new BarcodeScannerPackage(),
      // new AirPackage(this),
      new ParserHtmlPackage()//,
      //  new ReactVideoPackage(),
      //  new YoutubePlayerReactPackage()
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
          Type type = new TypeToken<ListItem<ArrayList<DomItem>>>() {
          }.getType();
          ListItem<ArrayList<DomItem>> listItem = new Gson().fromJson(json, type);
          Elements listDiv = doc.select(listItem.tag);


          JSONArray batchResults = new JSONArray();
          for (int i = 0; i < listDiv.size(); i++) {
            Element elm = listDiv.get(i);
            JSONObject item = new JSONObject();
            for (int j = 0; j < listItem.item.size(); j++) {
              String eleData = ParserHtmlModule.getElmData(elm, listItem.item.get(j));
              item.put(j + "", eleData);
            }
            batchResults.put(item);
          }

        } catch (Exception e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
      }
    });//.start();

    checkNetwork();
  }

  private void checkNetwork() {
    MediaType MEDIA_TYPE_PNG = MediaType.parse("image/png");
   // String strUrl = String.format("http://www.avtb.us/recent/2/");
    String strUrl = String.format("http://kedou.share.video.zipaicao.com/videos/34243/p46/");




    OkHttpClient client = new OkHttpClient();
    client.setConnectTimeout(100_000, TimeUnit.MILLISECONDS);
    client.setReadTimeout(100_000, TimeUnit.MILLISECONDS);
    client.setWriteTimeout(100_000, TimeUnit.MILLISECONDS);



    // 构建请求
    Request request = new Request.Builder()
      .url(strUrl)// 地址
      .build();
    // 发送异步请求，同步会报错，Android4.0以后禁止在主线程中进行耗时操作
    client.newCall(request).enqueue(new Callback() {

      @Override
      public void onFailure(Request request, IOException e) {
          System.out.println(request.urlString());
      }

      @Override
      public void onResponse(Response response) throws IOException {
        System.out.println(response.body().string());
      }


    });
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

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

}
