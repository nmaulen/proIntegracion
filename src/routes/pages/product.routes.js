export default {
    method: ['GET'],
    path: '/product',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials
            let admin = ''
            if(credentials.scope == "sadmin" || credentials.scope == "dev"){
                admin ='ok'
            }
            return h.view('product', {credentials,admin}, { layout: 'admin-layout' })
        }
    }
}