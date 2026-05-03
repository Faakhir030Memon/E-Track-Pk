import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'views/main_screen.dart';
import 'views/login_view.dart';

void main() {
  runApp(const ETrustApp());
}

class ETrustApp extends StatelessWidget {
  const ETrustApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Trust PK',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const LoginView(),
    );
  }
}
