Imports System.Runtime.Serialization

<DataContract()> _
Public Class etResponse

    <DataMember> _
    Public apiToken As String = ""

    <DataMember> _
    Public isOk As Boolean

    <DataMember> _
    Public msg As String = ""

    <DataMember> _
    Public id As String = ""

End Class

<DataContract> _
Public Class registrationId

    <DataMember> _
    Public sourceId As Integer = 0 '1: Android, 2: iOS

    <DataMember> _
    Public token As String = ""

    <DataMember> _
    Public regId As String = ""

    <DataMember> _
    Public appName As String = ""

End Class

<DataContract> _
Public Class notificationTopic

    <DataMember> _
    Public topic As String = ""

End Class

<DataContract> _
Public Class responseOk

    <DataMember> _
    Public isOk As Boolean = False

    <DataMember> _
    Public transId As String = ""

    <DataMember> _
    Public msg As String = ""

    <DataMember> _
    Public docNum As String = ""

End Class