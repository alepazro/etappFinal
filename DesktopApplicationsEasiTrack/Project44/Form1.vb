Imports System.IO
Imports System.Text
Imports Newtonsoft.Json

Public Class Form1
    Dim urlFile As String = ""
    Private Sub btnStart_Click(sender As Object, e As EventArgs) Handles btnStart.Click
        lblStatusRun.Text = "Runnig"
        lblStatusRun.BackColor = Color.LightGreen
        urlFile = CreateFile()
        Timer1.Enabled = True
    End Sub

    Private Sub btnStop_Click(sender As Object, e As EventArgs) Handles btnStop.Click
        lblStatusRun.Text = "Not Runnig"
        lblStatusRun.BackColor = Color.OrangeRed
        Timer1.Enabled = False
    End Sub

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        Form2.Show()
    End Sub

    Private Sub Timer1_Tick(sender As Object, e As EventArgs) Handles Timer1.Tick
        'SendUpdatePosition()
        Dim dl As New DataLayer
        Dim list As New List(Of JobTraking)
        dl.Execp44_CheckGeofencesJob()
        list = dl.GetDevicesTraking()
        SendUpdatePosition(list)
    End Sub
    Private Sub SendUpdatePosition(listTraking As List(Of JobTraking))

        Dim token As String
        Dim ListShipmentIdentifiers As New List(Of ShipmentIdentifiers)
        Dim ShipmentIdentifiers1 As ShipmentIdentifiers '= New ShipmentIdentifiers()
        Dim ListShipmentStops As New List(Of ShipmentStops)
        'Dim ShipmentStops1 As New ShipmentStops() ' = New ShipmentStops()


        Dim url As String = "https://na12.api.project44.com/api/v4/capacityproviders/tl/shipments/statusUpdates"
        Dim api = New Post()

        Dim up As UpdatePosition
        For Each element As JobTraking In listTraking
            up = New UpdatePosition()
            ListShipmentIdentifiers = New List(Of ShipmentIdentifiers)
            ShipmentIdentifiers1 = New ShipmentIdentifiers


            ShipmentIdentifiers1.type = "ORDER"
            ShipmentIdentifiers1.value = element.JobNumber
            ListShipmentIdentifiers.Add(ShipmentIdentifiers1)

            If element.StopID > 0 Then
                ListShipmentStops = New List(Of ShipmentStops)
                Dim pstop As New ShipmentStops()
                pstop.stopNumber = element.StopOrdenNumber
                pstop.carrierSuppliedEta = element.DueDate
                ListShipmentStops.Add(pstop)
            End If

            up.customerId = "tl_tracking"
            up.EventType = "ARRIVED"
            up.latitude = element.Lat
            up.longitude = element.Lng
            up.shipmentIdentifiers = ListShipmentIdentifiers
            up.shipmentStops = ListShipmentStops
            up.utcTimestamp = element.EventDate.ToString("yyyy-MM-ddTHH:mm:ss")

            Dim header = New List(Of Parameter) From {
            New Parameter("Authorization", "Bearer eyJraWQiOiJhVHBreGQyc1VLSFJteTljIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNjY3NTg3OTAyLCJleHAiOjE2Njc2MzExMDIsImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoiYXBwLTBvYTFvcGd0Yjd3bXFGVmJaMGg4QGNsaWVudC1hcHBsaWNhdGlvbnMucHJvamVjdDQ0LmNvbSIsImdpdmVuTmFtZSI6IkNsaWVudCIsImZhbWlseU5hbWUiOiIwb2Exb3BndGI3d21xRlZiWjBoOCIsInRlbmFudElkIjoiMTY1MDQ5MTcxNzE0OSIsImNvbXBhbnlVaWQiOiJiNjU0YWE0Ni0wMTgwLTRhZmQtYmNhMi01NGQzYTBhYWNmMjUiLCJsYWtlSWQiOiIxNjUzNTk3MzcxMTEyIiwiY2lkIjoiMG9hMW9wZ3RiN3dtcUZWYlowaDgiLCJhdXRoSWRwcyI6WyJPQVVUSDJfQ0xJRU5UX0NSRURFTlRJQUxTIl0sImp0aSI6ImQ4NWMzNTcwLWJhY2UtNGFhNy05MzgwLWM3MTdiOGRhMGY5MyJ9.Y-BVezGwQd8AWcOIARSn71ZK99dJXQSSDjH_PSEGcoX5mPL-EBe5pVm_PTLSZZ8MKKIiNPvu76Qkhs3mi5o-XZJWh1kJulNTE3pSrbdicsMdYs7LLqFW2RfEB_grlMB3MdDfVsciE1WrHApe8VQi_2uk4m1ShCSDHQEEnCUkEAEMoPNuyW_W62hebHkQrJ29P2wotlEUDeyaloyD9Ose_y-8dzSnNnRL_JNBUZC_9N8I3qfvl2xXsdmflLNNh4DqkzQRno17ZVfh2a-E8GYrPXOB3L2yhpon5Xbd28nxgkhE_FuYZO9w_W9qcvetSJhT3dEzzBThJUpULrThD0qlSQ")
            }
            Dim upJson = up 'JsonConvert.SerializeObject(up)
            Dim response = api.UpdatePositionPost(url, header, upJson)
            Dim result = JsonConvert.DeserializeObject(response)
            Dim dateEvent = DateTime.UtcNow()
            Dim message = dateEvent + ": -> " + result.ToString()
            TracingTest(urlFile, message)
            tbConsole.Text = tbConsole.Text & "-->" & result.ToString()
            tbConsole.ForeColor = Color.White
        Next
    End Sub
    Public Sub TracingTest(ByVal fileName As String, message As String)
        ' Add text to the file.
        'Dim info As Byte() = New UTF8Encoding(True).GetBytes(message)
        Dim fs As FileStream = File.OpenWrite(fileName)

        fs.Close()
        fs.Dispose()
        File.AppendAllText(fileName, Environment.NewLine + message)

    End Sub
    Public Function CreateFile() As String
        Dim path As String = "c:\Logs\log" + DateTime.UtcNow().ToString("dd-MM-yyyy") + ".txt"

        ' Create or overwrite the file.

        If (System.IO.File.Exists(path)) = False Then
            Dim fs As FileStream = File.Create(path)
        End If
        Return path

    End Function


End Class
