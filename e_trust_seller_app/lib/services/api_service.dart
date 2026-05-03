import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1'; // Localhost for Android Emulator

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);
    if (data['success']) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', data['data']['token']);
      await prefs.setString('subscription_status', data['data']['store']['subscription']['status']);
      await prefs.setString('subscription_plan', data['data']['store']['subscription']['plan']);
    }
    return data;
  }

  static Future<Map<String, dynamic>> checkScore(String phone) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/trust/check'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'phone': phone}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getAnalytics() async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/trust/analytics?days=7'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
    return jsonDecode(response.body);
  }
}
