Imports System.IO
Imports System.Text
Imports Newtonsoft.Json

Public Class Form1
    Dim urlFile As String = ""
    Private Sub btnStart_Click(sender As Object, e As EventArgs) Handles btnStart.Click
        lblStatusRun.Text = "Runnig"
        lblStatusRun.BackColor = Color.LightGreen
        'urlFile = CreateFile()
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
                     New Parameter("Authorization", "Bearer eyJraWQiOiJhVHBreGQyc1VLSFJteTljIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNjY3NTg3OTAyLCJleHAiOjE2Njc2MzExMDIsImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoiYXBwLTBvYTFvcGd0Yjd3bXFGVmJaMGg4QGNsaWVudC1hcHBsaWNhdGlvbnMucHJvamVjdDQ0LmNvbSIsImdpdmVuTmFtZSI6IkNsaWVudCIsImZhbWlseU5hbWUiOiIwb2Exb3BndGI3d21xRlZiWjBoOCIsInRlbmFudElkIjoiMTY1MDQ5MTcxNzE0OSIsImNvbXBhbnlVaWQiOiJiNjU0YWE0Ni0wMTgwLTRhZmQtYmNhMi01NGQzYTBhYWNmMjUiLCJsYWtlSWQiOiIxNjUzNTk3MzcxMTEyIiwiY2lkIjoiMG9hMW9wZ3RiN3dtcUZWYlowaDgiLCJhdXRoSWRwcyI6WyJPQVVUSDJfQ0xJRU5UX0NSRURFTlRJQUxTIl0sImp0aSI6ImQ4NWMzNTcwLWJhY2UtNGFhNy05MzgwLWM3MTdiOGRhMGY5MyJ9.Y-BVezGwQd8AWcOIARSn71ZK99dJXQSSDjH_PSEGcoX5mPL-EBe5pVm_PTLSZZ8MKKIiNPvu76Qkhs3mi5o-XZJWh1kJulNTE3pSrbdicsMdYs7LLqFW2RfEB_grlMB3MdDfVsciE1WrHApe8VQi_2uk4m1ShCSDHQEEnCUkEAEMoPNuyW_W62hebHkQrJ29P2wotlEUDeyaloyD9Ose_y-8dzSnNnRL_JNBUZC_9N8I3qfvl2xXsdmflLNNh4DqkzQRno17ZVfh2a-E8GYrPXOB3L2yhpon5Xbd28nxgkhE_FuYZO9w_W9qcvetSJhT3dEzzBThJUpULrThD0qlSQ")
                    }

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
                For Each item2 In stops
                    pstop.stopNumber = item2.StopNumber
                    pstop.carrierSuppliedEta = item2.DueDate
                    ListShipmentStops.Add(pstop)

                    ShipmentIdentifiers1.type = "ORDER"
                    ShipmentIdentifiers1.value = item2.JobNumber
                    ListShipmentIdentifiers.Add(ShipmentIdentifiers1)

                    up.customerId = item2.CustomerIDp44
                    up.eventType = "POSITION"
                    up.latitude = item2.Latitude
                    up.longitude = item2.Longitude
                    up.shipmentIdentifiers = ListShipmentIdentifiers
                    up.shipmentStops = ListShipmentStops
                    up.utcTimestamp = item2.EventDate.ToString("yyyy-MM-ddTHH:mm:ss")

                    Dim header1 = New List(Of Parameter) From {
                     New Parameter("Authorization", "Bearer eyJraWQiOiJhVHBreGQyc1VLSFJteTljIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNjY3NTg3OTAyLCJleHAiOjE2Njc2MzExMDIsImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoiYXBwLTBvYTFvcGd0Yjd3bXFGVmJaMGg4QGNsaWVudC1hcHBsaWNhdGlvbnMucHJvamVjdDQ0LmNvbSIsImdpdmVuTmFtZSI6IkNsaWVudCIsImZhbWlseU5hbWUiOiIwb2Exb3BndGI3d21xRlZiWjBoOCIsInRlbmFudElkIjoiMTY1MDQ5MTcxNzE0OSIsImNvbXBhbnlVaWQiOiJiNjU0YWE0Ni0wMTgwLTRhZmQtYmNhMi01NGQzYTBhYWNmMjUiLCJsYWtlSWQiOiIxNjUzNTk3MzcxMTEyIiwiY2lkIjoiMG9hMW9wZ3RiN3dtcUZWYlowaDgiLCJhdXRoSWRwcyI6WyJPQVVUSDJfQ0xJRU5UX0NSRURFTlRJQUxTIl0sImp0aSI6ImQ4NWMzNTcwLWJhY2UtNGFhNy05MzgwLWM3MTdiOGRhMGY5MyJ9.Y-BVezGwQd8AWcOIARSn71ZK99dJXQSSDjH_PSEGcoX5mPL-EBe5pVm_PTLSZZ8MKKIiNPvu76Qkhs3mi5o-XZJWh1kJulNTE3pSrbdicsMdYs7LLqFW2RfEB_grlMB3MdDfVsciE1WrHApe8VQi_2uk4m1ShCSDHQEEnCUkEAEMoPNuyW_W62hebHkQrJ29P2wotlEUDeyaloyD9Ose_y-8dzSnNnRL_JNBUZC_9N8I3qfvl2xXsdmflLNNh4DqkzQRno17ZVfh2a-E8GYrPXOB3L2yhpon5Xbd28nxgkhE_FuYZO9w_W9qcvetSJhT3dEzzBThJUpULrThD0qlSQ")
                    }

                    Dim upJson1 = up 'JsonConvert.SerializeObject(up)
                    Dim response1 = api.UpdatePositionPost(url, header1, upJson1)
                    Dim result1 = JsonConvert.DeserializeObject(response1)
                    Dim dateEvent1 = DateTime.UtcNow()
                    Dim message1 = dateEvent1 + ": -> " + result1.ToString()

                    'TracingTest(urlFile, message1)
                    tbConsole.Text = tbConsole.Text & "-->" & result1.ToString()
                    tbConsole.ForeColor = Color.White
                    dl.UpdateSend("", item2.ID, message1)
                Next
            End If
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
