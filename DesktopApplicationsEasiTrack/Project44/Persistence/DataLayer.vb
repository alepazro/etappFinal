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
            'strCommand = "p44_GetDevicesToSend"
            strCommand = "p44_GetDevicesToSendV2"
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
                itm.HdeviceID = reader.Item("HdeviceID")
                itm.HGeofencesID = reader.Item("HGeofencesID")
                itm.CompanyID = reader.Item("CompanyID")
                itm.JobID = reader.Item("JobID")
                itm.StopID = reader.Item("StopID")
                itm.JobStatus = reader.Item("JobStatus")
                itm.StopStatus = reader.Item("StopStatus")
                itm.DeviceID = reader.Item("DeviceID")
                itm.EventCode = reader.Item("EventCode")
                itm.EventDate = reader.Item("EventDate")
                itm.Latitude = reader.Item("Latitude")
                itm.Longitude = reader.Item("Longitude")
                itm.GeofenceID = reader.Item("GeofenceID")
                itm.DriverID = reader.Item("DriverID")
                itm.GPSStatus = reader.Item("GPSStatus")
                itm.intout = reader.Item("intout")
                itm.isLoad = reader.Item("Sentp44")
                itm.isLoadDate = reader.Item("Sentp44Date")
                itm.JobNumber = reader.Item("JobNumber")
                itm.StopNumber = reader.Item("StopNumber")
                itm.DueDate = reader.Item("DueDate")
                itm.CustomerIDp44 = reader.Item("CustomerIDp44")

                lst.Add(itm)
            Loop

            If Not reader.IsClosed Then
                reader.Close()
            End If

        Catch ex As Exception
            Dim mensake As String = ex.Message
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
            'strCommand = "p44_CheckGeofencesJob"
            strCommand = "p44LoadTableJobsTemp"
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

    Public Function UpdateSend(token As String, id As Integer, status As String)
        Dim lst As New List(Of JobTraking)
        Dim result As Boolean
        Try
            strCommand = "p44_UpdateTable_Jobs_p44Temp"
            conString = ConfigurationManager.ConnectionStrings("dbSql").ConnectionString
            conSQL = New SqlConnection(conString)
            Command = New SqlCommand
            Command.Connection = conSQL
            Command.CommandText = strCommand
            Command.CommandType = CommandType.StoredProcedure

            Dim partoken As New SqlClient.SqlParameter("@Token", SqlDbType.VarChar, 255)
            partoken.Direction = ParameterDirection.Input
            partoken.Value = token
            Command.Parameters.Add(partoken)

            Dim parid As New SqlClient.SqlParameter("@ID", SqlDbType.Int)
            parid.Direction = ParameterDirection.Input
            parid.Value = id
            Command.Parameters.Add(parid)

            Dim parStatus As New SqlClient.SqlParameter("@Status", SqlDbType.VarChar, 255)
            parStatus.Direction = ParameterDirection.Input
            parStatus.Value = status
            Command.Parameters.Add(parStatus)

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
    Public Function UpdateStop(token As String, id As Integer, status As String)
        Dim lst As New List(Of JobTraking)
        Dim result As Boolean
        Try
            strCommand = "p44_UpdateTable_JobsStopsV2"
            conString = ConfigurationManager.ConnectionStrings("dbSql").ConnectionString
            conSQL = New SqlConnection(conString)
            Command = New SqlCommand
            Command.Connection = conSQL
            Command.CommandText = strCommand
            Command.CommandType = CommandType.StoredProcedure

            Dim partoken As New SqlClient.SqlParameter("@Token", SqlDbType.VarChar, 255)
            partoken.Direction = ParameterDirection.Input
            partoken.Value = token
            Command.Parameters.Add(partoken)

            Dim parid As New SqlClient.SqlParameter("@ID", SqlDbType.Int)
            parid.Direction = ParameterDirection.Input
            parid.Value = id
            Command.Parameters.Add(parid)

            Dim parStatus As New SqlClient.SqlParameter("@Status", SqlDbType.VarChar, 255)
            parStatus.Direction = ParameterDirection.Input
            parStatus.Value = status
            Command.Parameters.Add(parStatus)

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


End Class
