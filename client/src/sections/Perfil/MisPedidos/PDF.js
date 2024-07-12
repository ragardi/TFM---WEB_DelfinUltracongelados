import React from 'react';
import { Page, Text, Image, Document, StyleSheet, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    h1Titulo: {
        fontSize: 35,
        color: 'rgb(0,72,153)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    divCabIzq: {
        width: '50%',
    },
    divCabDer: {
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divCabIzqPed: {
        marginLeft: 70,
        marginTop: 30,
    },
    divCabIzqFac: {
        marginLeft: 70,
    },
    logo: {
        width: 130
    },
    fuente: { 
        fontSize: 12
    },
    divTablaPedFac: {
        width: '100%',
        marginTop: 30,
        marginLeft: 'auto', 
        marginRight: 'auto', 
    },
    divTablaCabeceraFac: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textCabeceraTabla: {
        fontSize: 15,
        color: 'rgb(0,72,153)',
        marginBottom: 5
    },
    divPedidoFac: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tablaRowFacProdu: {
        width: '40%',
        textAlign: 'left',
    },
    tablaRowFac: {
        width: '20%',
        textAlign: 'center',
        marginBottom: 10
    },
    separator: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        marginVertical: 5,
    },
    divTotalFac: {
        marginTop: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    divTotal: {
        marginRight: 30,
        textAlign: 'right'
    }
});

export const PDF = ({ detallePedido }) => {
    let totalPrecio = 0;

    return (
        <Document>
            <Page style={styles.page}>
                {/* CABECERA */}
                <View style={styles.header}>
                    <View style={styles.divCabIzq}>
                        <View style={styles.divCabIzqFac}>
                            <Text style={styles.h1Titulo}>FACTURA</Text>
                        </View>
                        <View style={styles.divCabIzqPed}>
                            <Text>Fecha: {format(new Date(detallePedido[0].fecha), "dd-MM-yyyy")}</Text>
                            <Text>Nº Pedido: {detallePedido[0].c_pedido}</Text>
                        </View>
                    </View>
                    <View style={styles.divCabDer}>
                        <Image src="images/logo_delfin.png" style={styles.logo} />
                    </View>
                </View>

                {/* DATOS DELFIN */}
                <View>
                    <Text style={styles.fuente}>DELFIN</Text>
                    <Text style={styles.fuente}>CIF: A28627446</Text>
                    <Text style={styles.fuente}>Teléfono: 925 157 130</Text>
                    <Text style={styles.fuente}>Calle Colmenas, 35</Text>
                    <Text style={styles.fuente}>Ontígola (Toledo), CP: 45340</Text>
                </View>

                {/* TABLA DEL PEDIDO CON LOS PRODUCTOS */}
                <View style={styles.divTablaPedFac}>
                    {/* CABECERA DE LA TABLA DEL PEDIDO */}
                    <View style={styles.divTablaCabeceraFac}>
                        <View style={styles.tablaRowFacProdu}>
                            <Text style={styles.textCabeceraTabla}>Concepto</Text>
                        </View>
                        <View style={styles.tablaRowFac}>
                            <Text style={styles.textCabeceraTabla}>Cantidad</Text>
                        </View>
                        <View style={styles.tablaRowFac}>
                            <Text style={styles.textCabeceraTabla}>Precio</Text>
                        </View>
                        <View style={styles.tablaRowFac}>
                            <Text style={styles.textCabeceraTabla}>Total</Text>
                        </View>
                    </View>

                    {/* LOS PRODUCTOS DEL PEDIDO */}
                    {detallePedido.map((detalle) => {
                        totalPrecio += parseFloat(detalle.importe);

                        return (
                            <React.Fragment key={detalle.id}>
                                <View style={styles.divPedidoFac}>
                                    <View style={styles.tablaRowFacProdu}>
                                        <Text style={styles.fuente}>{detalle.d_produ}</Text>
                                    </View>
                                    <View style={styles.tablaRowFac}>
                                        <Text style={styles.fuente}>{detalle.cantidad}</Text>
                                    </View>
                                    <View style={styles.tablaRowFac}>
                                        <Text style={styles.fuente}>{detalle.precio}€</Text>
                                    </View>
                                    <View style={styles.tablaRowFac}>
                                        <Text style={styles.fuente}>{detalle.importe}€</Text>
                                    </View>
                                </View>
                                <View style={styles.separator}></View>
                            </React.Fragment>
                        );
                    })}

                    <View style={styles.divTotalFac}>
                        <View>
                            <Text style={styles.fuente}>Forma de pago: {
                                detallePedido[0].formaPago === "T" ? "Tarjeta" :
                                detallePedido[0].formaPago === "P" ? "PayPal" :
                                detallePedido[0].formaPago === "R" ? "Contra-Reembolso" :
                                ""
                            }</Text>
                        </View>
                        <View style={styles.divTotal}>
                            <Text style={styles.fuente}>IVA 21%: {(totalPrecio * 0.21).toFixed(2)}€</Text>
                            <Text style={styles.fuente}>Total: {totalPrecio.toFixed(2)}€</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
