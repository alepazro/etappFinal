Imports Newtonsoft.Json

Public Class Form1
    Private Sub btnStart_Click(sender As Object, e As EventArgs) Handles btnStart.Click
        lblStatusRun.Text = "Runnig"
        lblStatusRun.BackColor = Color.LightGreen
        Timer1.Enabled = True
    End Sub

    Private Sub btnStop_Click(sender As Object, e As EventArgs) Handles btnStop.Click
        lblStatusRun.Text = "Not Runnig"
        lblStatusRun.BackColor = Color.OrangeRed
        Timer1.Enabled = False
    End Sub

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        'NewClient.Show()
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
            up.utcTimestamp = element.EventDate

            Dim header = New List(Of Parameter) From {
            New Parameter("Authorization", "Bearer eyJraWQiOiJ1dDdjN1pyNldYckJyMjJrIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNjYzNzk5NDU5LCJleHAiOjE2NjM4NDI2NTksImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoiYXBwLTBvYTFvcGd0Yjd3bXFGVmJaMGg4QGNsaWVudC1hcHBsaWNhdGlvbnMucHJvamVjdDQ0LmNvbSIsImdpdmVuTmFtZSI6IkNsaWVudCIsImZhbWlseU5hbWUiOiIwb2Exb3BndGI3d21xRlZiWjBoOCIsInRlbmFudElkIjoiMTY1MDQ5MTcxNzE0OSIsImNvbXBhbnlVaWQiOiJiNjU0YWE0Ni0wMTgwLTRhZmQtYmNhMi01NGQzYTBhYWNmMjUiLCJsYWtlSWQiOiIxNjUzNTk3MzcxMTEyIiwiY2lkIjoiMG9hMW9wZ3RiN3dtcUZWYlowaDgiLCJhdXRoSWRwcyI6WyJPQVVUSDJfQ0xJRU5UX0NSRURFTlRJQUxTIl0sImp0aSI6ImFhYmI0MmNmLTI2NjQtNGYwNS04M2QzLTUxN2UzOGRlZGZhNyJ9.yM73lI2w3t1qDZcjDKEIs6jv2zDzaUEk3DWz8hJFW4YfgJibW5MBlRoEu0fS_gAbVqXLOaqQHi8VfokzsR2EAQBagq9yS4pcTqnKDXggQUvW0xd3z8ZtyYfE9KXgZnXymMZZNdh-0y1kZHb_Ran1zfuGmvnvxzcZdwoQ4ECDYoV-kUbyRku9asBsD-rA2Oswej1joUdqc5stX79EdS1P-huAlncqaDPZXDXmKZ7ungWdrJva1FDKWz7hv3FsLS0h0yBVjrKh2HIGqU9OnHteS-GlGXYAhse5WW_LtIRaK-QnUY5Q-kWzNxaGsQ1DEsDUlRas_foXUW7rNzgf2Qbt5g")
            }
            Dim upJson = JsonConvert.SerializeObject(up)
            Dim response = api.UpdatePositionPost(url, header, upJson)
            Dim result = JsonConvert.DeserializeObject(response)
            tbConsole.Text = tbConsole.Text & result.ToString()
        Next
    End Sub

    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub
End Class
