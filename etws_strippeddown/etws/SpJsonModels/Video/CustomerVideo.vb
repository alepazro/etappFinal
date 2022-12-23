
Imports System.Runtime.Serialization

<DataContract>
Public Class CustomerVideo
    <DataMember>
    Public CompanyName As String = ""
    <DataMember>
    Public FullName As String = ""
    <DataMember>
    Public Email As String = ""
    <DataMember>
    Public FleetVideo As List(Of FleetVideo) = New List(Of FleetVideo)
End Class
