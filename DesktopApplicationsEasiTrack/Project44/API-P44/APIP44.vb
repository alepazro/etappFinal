Imports System.Net.Http
Imports System.Text
Imports RestSharp

Public Class APIP44
    Public Function p44Authentication(requestUri As String, username As String, password As String, json As Object) As String

        Dim client = New RestClient(New Uri(requestUri))
        Dim request = New RestRequest()
        request.Method = Method.POST
        Dim auth = Encoding.ASCII.GetBytes(username + ":" + password)
        request.AddHeader("Authorization", "Basic " + Convert.ToBase64String(auth))
        request.AddJsonBody(json)
        Dim response = client.Execute(request).Content.ToString()
        Return response



        'Using client As New HttpClient()
        '    Dim URI As Uri = New Uri(requestUri)
        '    Dim auth = Encoding.ASCII.GetBytes(username + ":" + password)
        '    client.DefaultRequestHeaders.Authorization = New Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(auth))
        '    Dim response = Await client.GetAsync(URI)
        '    Dim content = response.Content
        '    Return Await content.ReadAsStringAsync()
        'End Using


    End Function

End Class
