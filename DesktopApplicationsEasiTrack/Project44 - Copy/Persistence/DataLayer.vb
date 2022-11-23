Imports System.Configuration
Imports System.Data.SqlClient

Public Class DataLayer
#Region "Declaratives"

    Private pSysModule As String = "DataLayer.vb"
    Private strCommand As String = ""
    Private conString As String = ""
    Private conSQL As SqlConnection
    Private Command As SqlCommand
    Private adapter As SqlDataAdapter
    'Private BL As New BLCommon
    ''Private strError As String = ""

#End Region
    Public Function GetDevicesTraking() As List(Of JobTraking)
        Dim lst As New List(Of JobTraking)
        Dim reader As SqlDataReader = Nothing
        Dim Duration As String = ""
        Dim itm As JobTraking
        Try
            strCommand = "p44_GetDevicesToSend"
            conString = ConfigurationManager.ConnectionStrings("dbSql").ConnectionString
            conSQL = New SqlConnection(conString)
            Command = New SqlCommand
            Command.Connection = conSQL
            Command.CommandText = strCommand
            Command.CommandType = CommandType.StoredProcedure

            If conSQL.State = ConnectionState.Closed Then
                conSQL.Open()
            End If

            reader = Command.ExecuteReader
            Do While reader.Read
                itm = New JobTraking
                itm.ID = reader.Item("ID")
                itm.CompanyID = reader.Item("CompanyID")
                itm.JobID = reader.Item("JobID")
                itm.StopID = reader.Item("StopID")
                itm.DeviceID = reader.Item("DeviceID")
                itm.TransactionID = reader.Item("TransactionID")
                itm.StatusID = reader.Item("StatusID")
                itm.EventToSendP44 = reader.Item("EventToSendP44")
                itm.EventCodeDevice = reader.Item("EventCodeDevice")
                itm.EventDate = reader.Item("EventDate")
                itm.Lat = reader.Item("Lat")
                itm.Lng = reader.Item("Lng")
                itm.CreatedOn = reader.Item("CreatedOn")
                itm.SendP44 = reader.Item("SendP44")
                itm.SendP44Date = reader.Item("SendP44Date")
                itm.Source = reader.Item("Source")
                itm.JobNumber = reader.Item("JobNumber")
                itm.StopOrdenNumber = reader.Item("StopOrdenNumber")
                itm.DueDate = reader.Item("DueDate")
                lst.Add(itm)
            Loop

            If Not reader.IsClosed Then
                reader.Close()
            End If

        Catch ex As Exception

        Finally
            If conSQL.State = ConnectionState.Open Then
                conSQL.Close()
            End If
        End Try

        Return lst

    End Function
    Public Function Execp44_CheckGeofencesJob()
        Dim lst As New List(Of JobTraking)
        Try
            strCommand = "p44_CheckGeofencesJob"
            conString = ConfigurationManager.ConnectionStrings("dbSql").ConnectionString
            conSQL = New SqlConnection(conString)
            Command = New SqlCommand
            Command.Connection = conSQL
            Command.CommandText = strCommand
            Command.CommandType = CommandType.StoredProcedure

            If conSQL.State = ConnectionState.Closed Then
                conSQL.Open()
            End If
            Command.ExecuteReader()
        Catch ex As Exception
        Finally
            If conSQL.State = ConnectionState.Open Then
                conSQL.Close()
            End If
        End Try

        Return lst

    End Function


End Class
