Imports Newtonsoft.Json

Public Class Form2
    Dim dl As DataLayer
    Private Async Sub btnSaveCustomer_Click(sender As Object, e As EventArgs) Handles btnSaveCustomer.Click
        Dim customer As New Customer
        Dim api As New APIP44
        customer.Username = tbtUsername.Text
        customer.Username = tbtPassword.Text
        lblMensaje.Text = ""
        lblMensaje.Hide()

        Dim client = New With {.name = tbtClient.Text}
        Dim jsonClient = JsonConvert.SerializeObject(client)
        Dim response = api.p44Authentication("https://na12.api.project44.com/api/v4/oauth2/client-applications", tbtUsername.Text, tbtPassword.Text, client)
        Dim tempError = New With {Key .httpStatusCode = ""}
        Dim result = JsonConvert.DeserializeAnonymousType(response, tempError)
        If result.httpStatusCode = "409" Then
            lblMensaje.Text = "* The client you are trying to create already exists or has more than five clients created."
            lblMensaje.ForeColor = Color.Red
            lblMensaje.Show()
        Else

        End If

        'Dim result = JsonConvert.DeserializeObject(response)


    End Sub

    Private Sub Form2_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        dl = New DataLayer
        cmbCompanies.DataSource = dl.GetCompanies().Tables(0)
        cmbCompanies.ValueMember = "ID"
        cmbCompanies.DisplayMember = "NAME"
        lblMensaje.Hide()


    End Sub

End Class