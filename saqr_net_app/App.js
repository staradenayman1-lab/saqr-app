
// ملف Android WebView مخصص لاكتشاف Emby Server تلقائيًا وفتح أول سيرفر بوضع الضيف

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Platform } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const [serverUrl, setServerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tryDefaultIPs = async () => {
      const commonIPs = [
        "http://192.168.1.2:8096",
        "http://192.168.1.3:8096",
        "http://192.168.0.2:8096",
        "http://192.168.0.3:8096"
      ];

      for (const ip of commonIPs) {
        try {
          const res = await fetch(ip + "/emby/System/Info/Public");
          const json = await res.json();
          if (json && json.ServerName) {
            setServerUrl(ip);
            setLoading(false);
            return;
          }
        } catch (e) {
          continue;
        }
      }

      setError("لم يتم العثور على سيرفر Emby على الشبكة.");
      setLoading(false);
    };

    tryDefaultIPs();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a1a" }}>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/616/616494.png" }} style={{ width: 150, height: 150, marginBottom: 20 }} />
        <Text style={{ color: "#fff", fontSize: 22, marginBottom: 10 }}>مستر صدوق</Text>
        <Text style={{ color: "#aaa", marginBottom: 30 }}>تصميم وإعداد: المهندس صادق الميسري</Text>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#1a1a1a" }}>
        <Text style={{ color: "#fff", fontSize: 20, marginBottom: 10 }}>خطأ</Text>
        <Text style={{ color: "#ccc", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  return <WebView source={{ uri: serverUrl }} style={{ flex: 1 }} javaScriptEnabled />;
}
