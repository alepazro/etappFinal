' NOTE: You can use the "Rename" command on the context menu to change the class name "ws" in code, svc and config file together.
' NOTE: In order to launch WCF Test Client for testing this service, please select ws.svc or ws.svc.vb at the Solution Explorer and start debugging.
Imports System
Imports System.Collections.Generic
Imports System.ServiceModel.Web
Imports System.ServiceModel.Activation.WebScriptServiceHostFactory
Imports System.Data
Imports System.Web.Script.Serialization
Imports etws.BLCommon

Imports System.IO
Imports Newtonsoft.Json

Public Class ws
    Implements Iws

    Public Sub DoWork() Implements Iws.DoWork
    End Sub

    Function saveForm(ByVal data As webForm) As responseOk Implements Iws.saveForm
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res.isOk = dl.saveWebForm(data.formId, data.qty, data.serviceId, data.ship, data.fn, data.ln, data.email, data.ph, data.cell,
                                      data.co, data.street, data.city, data.state, data.postalCode, data.ccType, data.ccNo, data.ccSec, data.ccMonth, data.ccYear, data.ccFn, data.ccLn,
                                      data.ccStreet, data.ccCity, data.ccState, data.ccPostal, data.msg, data.promoCode, data.repId, data.isOBDOption, data.isPostedSLOption)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function saveForm2(ByVal data As webForm) As responseOk Implements Iws.saveForm2
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res.isOk = dl.saveWebForm_v2(data.formId, data.qtyGX, data.qtyTF, data.qtyOBDTracker, data.qtyAssets, data.serviceId, data.ship, data.fn, data.ln, data.email, data.ph, data.cell, data.co, data.street, data.city, data.state, data.postalCode, data.ccType, data.ccNo, data.ccSec, data.ccMonth, data.ccYear, data.ccFn, data.ccLn, data.ccStreet, data.ccCity, data.ccState, data.ccPostal, data.msg, data.promoCode, data.repId, data.qtyOBDConnector, data.isPostedSLOption)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function getDocQty(ByVal docId As String) As qtyDoc Implements Iws.getDocQty
        Dim itm As New qtyDoc
        Dim dl As New DataLayer

        Try
            itm = dl.getDocQty(docId)
        Catch ex As Exception

        End Try

        Return itm

    End Function

    Function getShoppingCartInfo(ByVal token As String) As webForm Implements Iws.getShoppingCartInfo
        Dim wf As New webForm
        Dim dl As New DataLayer

        Try
            wf = dl.getShoppingCartInfo(token)
        Catch ex As Exception

        End Try

        Return wf

    End Function

    Function getCompanyInfo(ByVal token As String) As companyInfo Implements Iws.getCompanyInfo
        Dim c As New companyInfo
        Dim dl As New DataLayer

        Try
            c = dl.getCompanyInfo(token)
        Catch ex As Exception

        End Try

        Return c

    End Function

    Function getCompanyByUID(ByVal uid As String) As companyInfo2 Implements Iws.getCompanyByUID
        Dim itm As New companyInfo2
        Dim dl As New DataLayer
        Dim err As String = ""

        Try
            itm = dl.getCompanyInfo2(uid, err)
        Catch ex As Exception

        End Try

        Return itm

    End Function

    Function saveCompanyInfo(ByVal token As String, ByVal data As companyInfo) As responseOk Implements Iws.saveCompanyInfo
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res.isOk = dl.saveCompanyInfo(token, data)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function getCCInfo(ByVal token As String) As ccInfo Implements Iws.getCCInfo
        Dim cc As New ccInfo
        Dim dl As New DataLayer

        Try
            cc = dl.getCCInfo(token)
        Catch ex As Exception

        End Try

        Return cc

    End Function

    Function saveBillingInfo(ByVal token As String, ByVal data As ccInfo) As responseOk Implements Iws.saveBillingInfo
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res.isOk = dl.saveBillingInfo(token, data)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function getQuote(ByVal data As quoteForm) As responseOk Implements Iws.getQuote
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res.isOk = dl.saveWebForm(data.formId, data.qty, data.serviceId, data.ship, data.fn, data.ln, data.email, data.ph, "", data.co, "", "", "", "", "", "", "", 0, 0, "", "", "", "", "", "", "", "", "", False, False)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function getBasePrice() As priceList Implements Iws.getBasePrice
        Dim itm As New priceList
        Dim dl As New DataLayer

        Try
            itm = dl.getBasePrice
        Catch ex As Exception

        End Try

        Return itm

    End Function

    Function getCameras(ByVal data As wsRequest) As wsCamerasResponse Implements Iws.getCameras
        Dim itm As New wsCamerasResponse
        Dim dl As New DataLayer

        Try
            itm = dl.getCameras(data)
        Catch ex As Exception

        End Try

        Return itm

    End Function

#Region "Devices Commands OTA"

    Function sendDeviceCommand(ByVal data As deviceCommand) As responseOk Implements Iws.sendDeviceCommand
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res = dl.sendDeviceCommand(data)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function getDeviceResponses(ByVal deviceId As String) As List(Of deviceResponse) Implements Iws.getDeviceResponses
        Dim lst As New List(Of deviceResponse)
        Dim dl As New DataLayer

        Try

        Catch ex As Exception

        End Try

        Return lst

    End Function

    Function saveDeviceEvent(ByVal data As class_parsedMessage) As etwsResponse Implements Iws.saveDeviceEvent
        Dim dl As New dataLayerAPI
        Dim itm As New etwsResponse

        Try
            itm = dl.HDevices_INSERT(data)
        Catch ex As Exception

        End Try

        Return itm

    End Function

#End Region

#Region "TFTP Automation"

    Function getCfgScripts() As List(Of cfgFile) Implements Iws.getCfgScripts
        Dim lst As New List(Of cfgFile)
        Dim dl As New DataLayer

        Try
            lst = dl.getCfgScripts()
        Catch ex As Exception

        End Try

        Return lst

    End Function

    Function saveCfgScript(ByVal data As cfgFile) As responseOk Implements Iws.saveCfgScript
        Dim res As New responseOk
        Dim dl As New DataLayer

        Try
            res = dl.saveCfgScript(data)
        Catch ex As Exception

        End Try

        Return res

    End Function

    Function resetCfgScript(ByVal id As String) As responseOk Implements Iws.resetCfgScript
        Dim res As New responseOk
        Dim dl As New DataLayer
        Dim intID As Integer

        Try
            If IsNumeric(id) Then
                intID = CInt(id)
                res = dl.resetCfgScript(id)
            End If
        Catch ex As Exception

        End Try

        Return res

    End Function

#End Region

#Region "CRM"
    Public Function crmGetDeviceData(ByVal t As String, ByVal did As String) As String Implements Iws.crmGetDeviceData
        Dim strResult As String = ""
        Dim token As String = ""
        ''Dim pdid As String = ""
        Dim dl As New DataLayer
        'Dim parameter = JsonConvert.DeserializeObject(Data)
        Try
            If IsGUID(t) Then
                strResult = dl.CRM_HDevices_GET(t, did)
            End If

            If strResult = "" Then
                strResult = "false"
            End If

        Catch ex As Exception
            BLErrorHandling.ErrorCapture("crmGetDeviceData", "crmGetDeviceData", "", ex.Message, 0)
        End Try

        Return strResult
    End Function


#End Region



End Class
