import React, { Component } from 'react';
import { Text, Button as PaperButton, Card } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';

import styles from './styles';

class BlockedDayPicker extends Component {
  state = {
    showStartDatePicker: false,
    showEndDatePicker: false
  };

  toggleStartDatePicker = () =>
    this.setState(prevState => ({ showStartDatePicker: !prevState.showStartDatePicker }));

  toggleEndDatePicker = () =>
    this.setState(prevState => ({ showEndDatePicker: !prevState.showEndDatePicker }));

  render() {
    return (
      <Card style={{ marginVertical: 6, borderRadius: 8, elevation: 0, backgroundColor: '#fafafa' }}>
        <Card.Content style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 0 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#AE1131', minWidth: 90 }}>{this.props.day}</Text>
          <PaperButton
            mode="contained"
            onPress={this.toggleStartDatePicker}
            style={{ backgroundColor: '#AE1131', borderRadius: 6, marginHorizontal: 2 }}
            labelStyle={{ color: '#fff', fontSize: 15 }}
            compact={true}
          >
            {this.props.startTime ? this.props.startTime : 'Inicio'}
          </PaperButton>
          <PaperButton
            mode="contained"
            onPress={this.toggleEndDatePicker}
            style={{ backgroundColor: '#AE1131', borderRadius: 6, marginHorizontal: 2 }}
            labelStyle={{ color: '#fff', fontSize: 15 }}
            compact={true}
          >
            {this.props.endTime ? this.props.endTime : 'Fin'}
          </PaperButton>
        </Card.Content>
        <DateTimePicker
          isVisible={this.state.showStartDatePicker}
          mode="time"
          onCancel={this.toggleStartDatePicker}
          onConfirm={this.props.setStartTime}
        />
        <DateTimePicker
          isVisible={this.state.showEndDatePicker}
          mode="time"
          onCancel={this.toggleEndDatePicker}
          onConfirm={this.props.setEndTime}
        />
      </Card>
    );
  }
}

export default BlockedDayPicker;
