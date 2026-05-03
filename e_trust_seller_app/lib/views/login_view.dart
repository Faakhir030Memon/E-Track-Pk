import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'main_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../theme/app_theme.dart';

class LoginView extends StatefulWidget {
  const LoginView({super.key});
  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() => _isLoading = true);
    try {
      final response = await http.post(
        Uri.parse('${ApiService.baseUrl}/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailController.text,
          'password': _passwordController.text,
        }),
      );

      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', data['data']['token']);
        await prefs.setString('user_data', jsonEncode(data['data']['store']));
        
        if (mounted) {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MainScreen()));
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            backgroundColor: AppTheme.danger,
            content: Text(data['error'] ?? 'Login failed')
          ));
        }
      }
    } catch (e) {
       if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          backgroundColor: AppTheme.danger,
          content: Text('Network error. Check backend connection.')
        ));
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Padding(
        padding: const EdgeInsets.all(30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo Integration
            Image.asset(
              'assets/images/logo.png',
              height: 100,
              errorBuilder: (context, error, stackTrace) => Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Center(child: Text("ET", style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold))),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "E-Trust PK", 
              style: AppTheme.headingStyle.copyWith(fontSize: 28),
            ),
            const Text(
              "Seller Mobile Portal", 
              style: TextStyle(color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 50),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(hintText: "Email / Store ID", prefixIcon: Icon(Icons.email_outlined)),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(hintText: "Password", prefixIcon: Icon(Icons.lock_outline)),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                onPressed: _isLoading ? null : _login,
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text("Login", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
