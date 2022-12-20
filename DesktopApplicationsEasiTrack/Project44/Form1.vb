Imports System.IO
Imports System.Text
Imports Newtonsoft.Json

Public Class Form1
    Dim urlFile As String = ""
    Private Sub btnStart_Click(sender As Object, e As EventArgs) Handles btnStart.Click
        lblStatusRun.Text = "Runnig"
        lblStatusRun.BackColor = Color.LightGreen
        urlFile = CreateFile()
        lblLastupdate.Text = DateTime.UtcNow.ToString()
        Dim dl As New DataLayer
        Dim list As New List(Of JobTraking)
        dl.Execp44_CheckGeofencesJob()
        list = dl.GetDevicesTraking()
        SendUpdatePosition(list)
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
        Dim dl As New DataLayer


        Dim url As String = "https://na12.api.project44.com/api/v4/capacityproviders/tl/shipments/statusUpdates"
        Dim api = New Post()
        Dim up As New UpdatePosition
        Dim pstop As New ShipmentStops()


        Dim jobsID = (From c In listTraking Select c.JobID).Distinct().ToList()

        For Each item As Integer In jobsID

            Dim ListShipmentIdentifiers As New List(Of ShipmentIdentifiers)
            Dim ShipmentIdentifiers1 As New ShipmentIdentifiers '= New ShipmentIdentifiers()
            Dim ListShipmentStops As New List(Of ShipmentStops)



            Dim jobsnotgeofences = (From c In listTraking Where c.JobID = item And c.GeofenceID = 0).ToList()

            Dim jobsgeofences = (From c In listTraking Where c.GeofenceID > 0 And c.JobID = item).ToList()
            If jobsgeofences.Count > 0 Then
                For Each itemg In jobsgeofences
                    If itemg.StopID > 0 Then
                        pstop = New ShipmentStops()
                        pstop.stopNumber = itemg.StopNumber
                        pstop.carrierSuppliedEta = itemg.DueDate
                        ListShipmentStops.Add(pstop)
                        dl.UpdateStop("", itemg.StopID, "23")
                    End If

                    ShipmentIdentifiers1.type = "ORDER"
                    ShipmentIdentifiers1.value = itemg.JobNumber
                    ListShipmentIdentifiers.Add(ShipmentIdentifiers1)

                    up.customerId = itemg.CustomerIDp44
                    up.eventType = "ARRIVED" 'POSITION
                    up.latitude = itemg.Latitude
                    up.longitude = itemg.Longitude
                    up.shipmentIdentifiers = ListShipmentIdentifiers
                    up.shipmentStops = ListShipmentStops
                    up.utcTimestamp = itemg.EventDate.ToString("yyyy-MM-ddTHH:mm:ss")

                    Dim header1 = New List(Of Parameter) From {
                     New Parameter("Authorization", "Bearer eyJraWQiOiJhVHBreGQyc1VLSFJteTljIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNjcxNTQ3NTkyLCJleHAiOjE2NzE1OTA3OTIsImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoiYXBwLTBvYTFvcGd0Yjd3bXFGVmJaMGg4QGNsaWVudC1hcHBsaWNhdGlvbnMucHJvamVjdDQ0LmNvbSIsImdpdmVuTmFtZSI6IkNsaWVudCIsImZhbWlseU5hbWUiOiIwb2Exb3BndGI3d21xRlZiWjBoOCIsInRlbmFudElkIjoiMTY1MDQ5MTcxNzE0OSIsImNvbXBhbnlVaWQiOiJiNjU0YWE0Ni0wMTgwLTRhZmQtYmNhMi01NGQzYTBhYWNmMjUiLCJsYWtlSWQiOiIxNjUzNTk3MzcxMTEyIiwiY2lkIjoiMG9hMW9wZ3RiN3dtcUZWYlowaDgiLCJhdXRoSWRwcyI6WyJPQVVUSDJfQ0xJRU5UX0NSRURFTlRJQUxTIl0sImp0aSI6ImQ5N2NjMjIwLWRkYmYtNDBmYS1iNjc5LTE0MGYxZTcxOTFkOSJ9.GPA6Y6y3Rxhb9Ju-CuFoUcyN4KPNkJygl0YQOYLtu-hNNiNh9mv0q9SeZffKmok8Rgmhu23Bb146wKOc3j-cdLJms2pdouWmrVUB2hd0vJeZnUi1r8SpyIwLHGWcNOhpRpcdq_fVuqLBql8uDTDpeofdDFIaLj8CgZa0TCgkGlZpHitBeudSlfM5S5w9F7NvS0b5v7JmrvFGYlbfCFxz-CGUFioplXIjaMP3CFqWc4YSA-L1debUYIiSVjHRX_u16uTgJBpYJpNGOd-rQgQZuvnsC6PB216aoufD9AmyFlOVqH-7Ee_Uhop3lDxcItDpXsEVkpHeJFHIRvUz8wAMhA")}

                    Dim upJson1 = up 'JsonConvert.SerializeObject(up)
                    Dim response1 = api.UpdatePositionPost(url, header1, upJson1)
                    Dim result1 = JsonConvert.DeserializeObject(response1)
                    Dim dateEvent1 = DateTime.UtcNow()
                    Dim message1 = dateEvent1 + ": -> " + result1.ToString()

                    TracingTest(urlFile, message1)
                    tbConsole.Text = tbConsole.Text & "-->" & result1.ToString()
                    tbConsole.ForeColor = Color.White
                    dl.UpdateSend("", itemg.ID, message1)

                Next
            Else
                Dim stops = (From c In jobsnotgeofences Where c.StopID > 0 Select c Order By c.HdeviceID Descending).Distinct().ToList()
                If stops.Count > 0 Then
                    For Each item2 In stops
                        pstop.stopNumber = item2.StopNumber
                        pstop.carrierSuppliedEta = item2.DueDate
                        ListShipmentStops.Add(pstop)
                    Next
                    up.shipmentStops = ListShipmentStops
                End If

                Dim lastupdatejob = (From c In jobsnotgeofences Select c Order By c.HdeviceID Descending).FirstOrDefault()
                ShipmentIdentifiers1.type = "ORDER"
                ShipmentIdentifiers1.value = lastupdatejob.JobNumber
                ListShipmentIdentifiers.Add(ShipmentIdentifiers1)

                up.customerId = lastupdatejob.CustomerIDp44
                up.eventType = "POSITION"
                up.latitude = lastupdatejob.Latitude
                up.longitude = lastupdatejob.Longitude
                up.shipmentIdentifiers = ListShipmentIdentifiers
                up.utcTimestamp = lastupdatejob.EventDate.ToString("yyyy-MM-ddTHH:mm:ss")

                Dim header1 = New List(Of Parameter) From {
                     New Parameter("Authorization", "Bearer eyJraWQiOiJhVHBreGQyc1VLSFJteTljIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNjcxNTU1NTAxLCJleHAiOjE2NzE1OTg3MDEsImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoiYXBwLTBvYTFvcGd0Yjd3bXFGVmJaMGg4QGNsaWVudC1hcHBsaWNhdGlvbnMucHJvamVjdDQ0LmNvbSIsImdpdmVuTmFtZSI6IkNsaWVudCIsImZhbWlseU5hbWUiOiIwb2Exb3BndGI3d21xRlZiWjBoOCIsInRlbmFudElkIjoiMTY1MDQ5MTcxNzE0OSIsImNvbXBhbnlVaWQiOiJiNjU0YWE0Ni0wMTgwLTRhZmQtYmNhMi01NGQzYTBhYWNmMjUiLCJsYWtlSWQiOiIxNjUzNTk3MzcxMTEyIiwiY2lkIjoiMG9hMW9wZ3RiN3dtcUZWYlowaDgiLCJhdXRoSWRwcyI6WyJPQVVUSDJfQ0xJRU5UX0NSRURFTlRJQUxTIl0sImp0aSI6IjYyZjQyMWRhLTMyM2UtNDI1My1hNzMwLTA0YzFjNmJhNjU0MSJ9.iviqZITgbqC6GYp-kOIqhQbZRGd1inFvy5Lu1LsMFXbRqmliCufzx4UmR-R3ZjQrH4GUB4QxKFs1ShscQgpruoTtfqSJCjp1mswcBjntXDPUSgOJiHX2eR-QRvBe61y7MvhBUK7_Gu0lgbSHer8CF1cHhHtDcoYzkGwSinIO5ZvU4iRYeoZL4zsRSWQrk_k-w8eUrjOJS2SaWU8opcDA_UpmjQZ2L_crdXwpSpONG6KJvRxZdAM2hsQhaLeGPmG5cB4ND4hlsadMmaQ9IHqWVQjORZM2SG06VOaBWNTD7Vcqa6TmTS99tMLoLw-W062N6IfVj-xzMIG8j1yC37j_0g")}
                Dim upJson1 = up 'JsonConvert.SerializeObject(up)
                Dim response1 = api.UpdatePositionPost(url, header1, upJson1)
                Dim result1 = JsonConvert.DeserializeObject(response1)
                Dim dateEvent1 = DateTime.UtcNow()
                Dim message1 = dateEvent1 + ": -> " + result1.ToString()

                TracingTest(urlFile, message1)
                tbConsole.Text = tbConsole.Text & "-->" & result1.ToString()
                tbConsole.ForeColor = Color.White

                dl.UpdateSend("", lastupdatejob.ID, message1)
            End If
        Next
        lblLastupdate.Text = DateTime.UtcNow.ToString()

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
