import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:rutas_app/constants.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:http/http.dart' as http;
import 'dart:convert';

class OrderTrackingPage extends StatefulWidget {
  const OrderTrackingPage({Key? key}) : super(key: key);

  @override
  State<OrderTrackingPage> createState() => OrderTrackingPageState();
}

class OrderTrackingPageState extends State<OrderTrackingPage> {
  final Completer<GoogleMapController> _controller = Completer();

  static const LatLng sourceLocation =
      LatLng(-19.03893489509178, -65.24435258870824);
  static const LatLng destination =
      LatLng(-19.054530684019465, -65.25347503517625);

  List<LatLng> polylineCoordinates = [];
  List<LatLng> pedidos = [];
  LocationData? currentLocation;
  late IO.Socket socket;

  void getCurrentLocation() async {
    final Location location = Location();

    location.getLocation().then((location) {
      currentLocation = location;
    });

    location.onLocationChanged.listen((newLoc) {
      currentLocation = newLoc;

      socket.emit('sendLocation', {
        'latitude': newLoc.latitude,
        'longitude': newLoc.longitude,
      });

      setState(() {});
    });
  }

  void getPolylines() async {
    PolylinePoints polylinePoints = PolylinePoints();

    PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
      dotenv.env['GOOGLE_API_KEY']!,
      PointLatLng(sourceLocation.latitude, sourceLocation.longitude),
      PointLatLng(destination.latitude, destination.longitude),
    );

    if (result.points.isNotEmpty) {
      result.points.forEach((PointLatLng point) {
        polylineCoordinates.add(LatLng(point.latitude, point.longitude));
      });
      setState(() {
        print(polylineCoordinates);
      });
    }
  }

  Future<void> fetchRoute() async {
    final response =
        await http.get(Uri.parse('http://192.168.100.48:3000/rutas/9'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      List<dynamic> rutaOptimizada = data['ruta_optimizada'];
      pedidos = data['pedidos']
          .map<LatLng>(
              (pedido) => LatLng(pedido['latitud'], pedido['longitud']))
          .toList();

      polylineCoordinates =
          rutaOptimizada.map((point) => LatLng(point[1], point[0])).toList();

      setState(() {
        print(polylineCoordinates);
      });
    } else {
      throw Exception('Failed to load route');
    }
  }

  void initSocket() {
    socket = IO.io('http://192.168.100.48:3000', <String, dynamic>{
      'transports': ['websocket'],
    });

    socket.on('connect', (_) {
      print('conectado');
    });

    socket.on('disconnect', (_) {
      print('desconectado');
    });

    socket.on('connect_error', (error) {
      print('Error de conexión: $error');
    });
  }

  @override
  void initState() {
    initSocket();
    getCurrentLocation();
    // getPolylines();
    super.initState();
    fetchRoute();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        // appBar: AppBar(
        //   title: const Text(
        //     "Track order",
        //     style: TextStyle(color: Colors.black, fontSize: 16),
        //   ),
        // ),
        body: currentLocation == null
            ? const Center(
                child: Text("Loading"),
              )
            : GoogleMap(
                initialCameraPosition: CameraPosition(
                    target: LatLng(currentLocation!.latitude!,
                        currentLocation!.longitude!),
                    zoom: 14.5),
                polylines: {
                  Polyline(
                    polylineId: PolylineId('route'),
                    points: polylineCoordinates,
                    color: primaryColor,
                    width: 6,
                  )
                },
                markers: {
                  Marker(
                      markerId: MarkerId("currentLocation"),
                      position: LatLng(currentLocation!.latitude!,
                          currentLocation!.longitude!)),
                  for (int i = 0; i < pedidos.length; i++)
                    Marker(
                        markerId: MarkerId("pedido$i"),
                        position: pedidos[i],
                        icon: BitmapDescriptor.defaultMarkerWithHue(
                            BitmapDescriptor.hueGreen),
                        infoWindow: InfoWindow(title: 'Pedido $i')),
                },
                onMapCreated: (mapController) => {
                  _controller.complete(mapController),
                },
              ));
  }
}
