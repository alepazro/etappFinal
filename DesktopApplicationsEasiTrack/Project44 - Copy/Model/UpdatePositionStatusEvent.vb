Public Class UpdatePositionStatusEvent
    Public customerId As String
    Public eventType As String
    Public latitude As Decimal
    Public longitude As Decimal
    Public shipmentIdentifiers As List(Of ShipmentIdentifiers)
    Public utcTimestamp As DateTime
End Class
