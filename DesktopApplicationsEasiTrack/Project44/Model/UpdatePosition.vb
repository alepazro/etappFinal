Public Class UpdatePosition
    Public customerId As String
    Public eventType As String
    Public latitude As Decimal
    Public longitude As Decimal
    Public latestTemperature As Integer
    Public latestTemperatureUnit As String
    Public shipmentIdentifiers As List(Of ShipmentIdentifiers)
    Public shipmentStops As List(Of ShipmentStops)
    Public utcTimestamp As String
End Class
