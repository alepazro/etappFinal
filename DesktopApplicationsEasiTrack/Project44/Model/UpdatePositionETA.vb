Public Class UpdatePositionETA
    Public customerId As String
    Public latitude As Decimal
    Public longitude As Decimal
    Public shipmentIdentifiers As List(Of ShipmentIdentifiers)
    Public shipmentStops As List(Of ShipmentStops)
    Public utcTimestamp As DateTime
End Class
