package com.leapar.module;

/**
 * Created by wangxh on 2016/5/22.
 */

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.parser.Parser;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.leapar.model.DomItem;
import com.leapar.model.ListItem;


import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ParserHtmlModule extends ReactContextBaseJavaModule {

    public ParserHtmlModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "HTMLParser";
    }

    public static String getElmData(Element elem, DomItem item) {
        try {
            elem = elem.select(item.tag).first();

            Method method = null;
            if (item.arg != null) {
                if(item.func.equalsIgnoreCase("reg_exp")) {
                    Pattern p = Pattern.compile(item.arg);//"video_url: '(.*?)\\/'"
                    Matcher m = p.matcher(elem.html());
                    while(m.find()){
                       return m.group(1);
                    }
                    return "";
                } else {
                    method = Element.class.getMethod(item.func, new Class[]{String.class});
                }
            } else {
                method = Element.class.getMethod(item.func, new Class[]{});
            }

            if(!method.isAccessible()) {
                method.setAccessible(true);
            }
            if (item.arg != null) {
              String val = (String) method.invoke(elem, new Object[]{item.arg});
              if (item.arg.equals("style")) {
                Pattern p = Pattern.compile("url\\((.*?)\\)");//"video_url: '(.*?)\\/'"
                Matcher m = p.matcher(val);
                while(m.find()){
                  return m.group(1);
                }
              }
              return val;
            }else {
              return (String) method.invoke(elem, new Object[]{});
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @ReactMethod
    public void getListInfo(String html,String url,String json, Promise promise) {
        try {
            JSONArray batchResults = new JSONArray();
            Document document = Parser.parse(html, url);
            Type type = new TypeToken<ListItem<ArrayList<DomItem>>>(){}.getType();
            ListItem<ArrayList<DomItem>> listItem = new Gson().fromJson(json, type);
            Elements listDiv = document.select(listItem.tag);
            int pos = 0;
            int max = listDiv.size();

            if(listItem.index != null && listItem.index > 0) {
                pos = listItem.index;
                max = listItem.index + 1;
            }

            for (int i = pos; i < max; i++) {
                Element elm = listDiv.get(i);
                JSONObject item = new JSONObject();
                for(int j = 0; j < listItem.item.size();j++) {
                    String eleData = ParserHtmlModule.getElmData(elm, listItem.item.get(j));
                    item.put(listItem.item.get(j).name, eleData);
                }
                batchResults.put(item);
            }
            promise.resolve(batchResults.toString());
        } catch (Exception e) {
            promise.reject("500",e.getMessage());
        }
    }
}
