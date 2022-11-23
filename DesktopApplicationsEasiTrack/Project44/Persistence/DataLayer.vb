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
    Public Function AddCustomer(CompanyID As Integer, ClientId As String, ClientSecret As String, GrantType As String, UrlToken As String,
                                Token As String, LastUpdateToken As String, Authorized As Boolean, CreatedOn As DateTime, LastUpdate As DateTime)
        Dim lst As New List(Of JobTraking)
        Dim result As Boolean
        Try
            strCommand = "p44_AddCustomers"
            conString = ConfigurationManager.ConnectionStrings("dbSql").ConnectionString
            conSQL = New SqlConnection(conString)
            Command = New SqlCommand
            Command.Connection = conSQL
            Command.CommandText = strCommand
            Command.CommandType = CommandType.StoredProcedure

            Dim parCompanyID As New SqlClient.SqlParameter("@CompanyID", SqlDbType.Int)
            parCompanyID.Direction = ParameterDirection.Input
            parCompanyID.Value = CompanyID
            Command.Parameters.Add(parCompanyID)

            Dim parClientId As New SqlClient.SqlParameter("@ClientId", SqlDbType.VarChar, 255)
            parClientId.Direction = ParameterDirection.Input
            parClientId.Value = ClientId
            Command.Parameters.Add(parClientId)

            Dim parClientSecretd As New SqlClient.SqlParameter("@ClientSecret", SqlDbType.VarChar, 255)
            parClientSecretd.Direction = ParameterDirection.Input
            parClientSecretd.Value = ClientSecret
            Command.Parameters.Add(parClientSecretd)

            Dim parGrantType As New SqlClient.SqlParameter("@GrantType", SqlDbType.VarChar, 255)
            parGrantType.Direction = ParameterDirection.Input
            parGrantType.Value = GrantType
            Command.Parameters.Add(parGrantType)

            Dim parUrlToken As New SqlClient.SqlParameter("@UrlToken", SqlDbType.VarChar, 255)
            parUrlToken.Direction = ParameterDirection.Input
            parUrlToken.Value = UrlToken
            Command.Parameters.Add(parUrlToken)

            Dim parToken As New SqlClient.SqlParameter("@Token", SqlDbType.VarChar, 255)
            parToken.Direction = ParameterDirection.Input
            parToken.Value = Token
            Command.Parameters.Add(parToken)

            Dim parLastUpdateToken As New SqlClient.SqlParameter("@LastUpdateToken", SqlDbType.DateTime)
            parLastUpdateToken.Direction = ParameterDirection.Input
            parToken.Value = LastUpdateToken
            Command.Parameters.Add(parLastUpdateToken)

            Dim parAuthorized As New SqlClient.SqlParameter("@Authorized", SqlDbType.Bit)
            parAuthorized.Direction = ParameterDirection.Input
            parAuthorized.Value = Authorized
            Command.Parameters.Add(parAuthorized)

            Dim parCreatedOn As New SqlClient.SqlParameter("@CreatedOn", SqlDbType.DateTime)
            parCreatedOn.Direction = ParameterDirection.Input
            parCreatedOn.Value = CreatedOn
            Command.Parameters.Add(parCreatedOn)

            Dim parLastUpdate As New SqlClient.SqlParameter("@LastUpdate", SqlDbType.DateTime)
            parLastUpdate.Direction = ParameterDirection.Input
            parLastUpdate.Value = LastUpdate
            Command.Parameters.Add(parLastUpdate)

            Dim parIsOk As New SqlClient.SqlParameter("@IsOk", SqlDbType.Bit)
            parIsOk.Direction = ParameterDirection.Output
            Command.Parameters.Add(parIsOk)

            If conSQL.State = ConnectionState.Closed Then
                conSQL.Open()
            End If
            Command.ExecuteReader()
            result = CBool(parIsOk.Value)
        Catch ex As Exception
        Finally
            If conSQL.State = ConnectionState.Open Then
                conSQL.Close()
            End If
        End Try

        Return lst

    End Function
    Public Function GetCompanies() As DataSet
        Dim dsData As New DataSet

        Try
            strCommand = "p44_GetCompanies"
            conString = ConfigurationManager.ConnectionStrings("dbSql").ConnectionString
            conSQL = New SqlConnection(conString)
            Command = New SqlCommand
            Command.Connection = conSQL
            Command.CommandText = strCommand
            Command.CommandType = CommandType.StoredProcedure

            If conSQL.State = ConnectionState.Closed Then
                conSQL.Open()
            End If

            adapter = New SqlDataAdapter(Command)
            adapter.Fill(dsData)
            adapter.Dispose()
            Command.Dispose()

        Catch ex As Exception
        Finally
            If conSQL.State = ConnectionState.Open Then
                conSQL.Close()
            End If
        End Try

        Return dsData

    End Function


End Class
